/// fast'n'dirty test...

var screen_w=900, screen_h=626;
var kanwa=document.getElementById("ekraniszcze");
var kontekst=kanwa.getContext("2d");

/// graphics ///
var bitmap_loading_progress=0;

loadImage=function(url){
    var i=new Image();
    i.src=url;
    i.onload=function(){console.log(++bitmap_loading_progress);}
    return(i);
};

var Sprites = {'HERO' : {'up':loadImage('img/hero-up.png'),
			 'down':loadImage('img/hero-down.png'),
			 'up2':loadImage('img/hero-up2.png'),
			 'down2':loadImage('img/hero-down2.png'),
			 'left':loadImage('img/hero-left.png'),
			 'right':loadImage('img/hero-right.png')},
	       'WALL':{'up':loadImage('img/wall-up.png'),
		       'down':loadImage('img/wall-down.png'),
		       'left':loadImage('img/wall-left.png'),
		       'right':loadImage('img/wall-right.png')},
	       'FIRE': loadImage('img/jebs.png'),
	       'DOOR': loadImage('img/lock.png'),
	       'KEY': loadImage('img/key.png'),
	       'NIDERITE': loadImage('img/niderite.png'),
	       'GUN-L': loadImage('img/gun-left.png'),
	       'GUN-R': loadImage('img/gun-right.png'),
	       'GUN-U': loadImage('img/gun-up.png'),
	       'GUN-D': loadImage('img/gun-down.png'),
	       'PARTICLE': [loadImage('img/proton-left.png'),loadImage('img/proton-right.png')],
	       'ANT': {'up':loadImage('img/ant-up.png'),
		       'down':loadImage('img/ant-down.png'),
		       'left':loadImage('img/ant-left.png'),
		       'right':loadImage('img/ant-right.png')}
	      };

var Background = loadImage('img/background.png');
var Msg = loadImage('img/msg.png');

/// LEVEL: /////////////////////////////////////////////

find_by_id = function(level, o_id) {
    for(var i=0;i<level.objects.length;i++) {
	var object = level.objects[i];
	if(object == null) continue;
	if(object.id == o_id) return(object);
    }
    return(null);
};

find_by_pos = function(level, x, y) {
    for(var i=0;i<level.objects.length;i++) {
	var object = level.objects[i];
	if(object == null) continue;
	if(object.x == x && object.y == y) return(object);
    }
    return(null);
};

clean_up = function(level) {
    var new_objects = [];
    for(var i=0;i<level.objects.length;i++) {
	var object = level.objects[i];
	if(object == null) continue;
	new_objects.push(object);
    }
    level.objects = new_objects;
    return(level);
};

update_object = function(level, o_id, obj) {
    for(var i=0;i<level.objects.length;i++) {
	var object = level.objects[i];
	if(object == null) continue;
	if(object.id == o_id) {
	    level.objects[i] = obj;
	    break;
	}
    }
    return(level);
};

delete_object = function(level, o_id) {
    level = update_object(level, o_id, null);
    return(level);
};

spawn_object = function(level, obj, anyway) {
    var id = 0;
    var already_something = find_by_pos(level, obj.x, obj.y);
    if(!anyway && already_something != null) return(level);
    for(var i=0;i<level.objects.length;i++) {
	var object = level.objects[i];
	if(object == null) continue;
	if(object.id >= id) id = object.id;
    }
    id++; /// next free id
    obj.id = id;
    level.objects.push(obj);
    return(level);
};


move_object = function(level, o_id, nx, ny) {
    //console.log('move '+o_id+' to '+nx+','+ny);
    var o1 = find_by_id(level, o_id);
    var o2 = find_by_pos(level, nx, ny);
    if(o1 == null) {
	level = level;
    } else if(o2 == null) {
	//console.log('free tile');
	o1.x = nx;
	o1.y = ny;
	level = update_object(level, o_id, o1);
    } else {
	//console.log('collision of '+o1.type+' with '+o2.type);
	level = collision(level, o1.id, o2.id);
    }    
    return(level);
};

new_fire = function(x, y, expires) {
    return({
	'id': -1,
	'type': 'FIRE',
	'x': x,
	'y': y,
	'dx': 0,
	'dy': 0,
	'expires': expires
    });
};

new_particle = function(x, y, dx, dy) {
    return({
	'id': -1,
	'type': 'PARTICLE',
	'x': x,
	'y': y,
	'dx': dx,
	'dy': dy
    });
};


explosion = function(level, x, y, r) {   
    if(r==0) { /// very tiny one
	var obj = find_by_pos(level, x, y);
	if(obj != null && obj.type!='WALL') {
	    level = delete_object(level, obj.id);
	}
	if(obj == null || obj.type!='WALL') {
	    level = spawn_object(level, new_fire(x, y, 1), false);
	}
	return(level);
    }   
    /// else 
    for(var i=-r;i<=r;i++) {
	for(var j=-r;j<=r;j++) {
	    var obj = find_by_pos(level, x+i, y+j);
	    /// todo: różne rzeczy będą różnie wybuchały...
	    if(obj != null && obj.type!='WALL') {
		level = delete_object(level, obj.id);
	    }
	    if(obj == null || obj.type!='WALL') {
		level = spawn_object(level, new_fire(x+i, y+j, 1/*2*/), false);
	    }
	}
    }
    return(level);
};

signum = function(x) {
    if(x<0) return -1;
    else if(x==0) return 0;
    else return 1;
};

get_facing = function(dx,dy) {
    if(dx>0) return 'right';
    else if(dy<0) return 'up';
    else if(dy>0) return 'down';
    else return 'left';
};

get_facing2 = function(of,dx,dy) {
    if(dx>0) return 'right';
    else if(dy<0) {
	if(of=='left' || of=='down' || of=='up2') return 'up2';
	else return 'up';
    } else if(dy>0) {
	if(of=='left' || of=='up' || of=='down2') return 'down2';
	return 'down';
    }
    else return 'left';
};

collision = function(level, o1_id, o2_id) {
    var o1 = find_by_id(level, o1_id);
    var o2 = find_by_id(level, o2_id);    
    /// " assert(o1!=null && o2!=null) "
    switch(o1.type) {

    case 'HERO':
	switch(o2.type) {

	case 'KEY':
	    level = delete_object(level, o2.id);
	    level.state.keys++;
	    break;

	case 'DOOR':
	    if(level.state.keys>0) {
		level = delete_object(level, o2.id);
		level.state.keys--;
	    }
	    break;
	    
//	case 'FIRE':
	case 'PARTICLE':
	    level = explosion(level, o1.x, o1.y, 0);
	    break;

	case 'NIDERITE': // !!
	    o2.dx=o1.dx;
	    o2.dy=o1.dy;
	    break;

	default:
	    level = level;
	}
	break;

    case 'ANT':
	switch(o2.type) {
	case 'HERO':
	    level = explosion(level, o2.x, o2.y, 0);
	    break;

	case 'PARTICLE':
	case 'FIRE':
	    level = explosion(level, o1.x, o1.y, 0);
	    //level = delete_object(level, o1.id);
	    break;

	case 'NIDERITE':
	    level = explosion(level, o1.x, o1.y, 0); // ?!
	    o2.dx*=-1;
	    o2.dy*=-1;
	    break;

	default:
	    /*
	    var tmp = o1.dx;
	    o1.dx = -o1.dy;
	    o1.dy = tmp;
	    */
	    o1.dx*=-1;
	    o1.dy*=-1;
	    level = update_object(level, o1.id, o1);
	}
	break;

    case 'NIDERITE':
	switch(o2.type) {
	case 'NIDERITE':
	    level = explosion(level, o1.x, o1.y, 0);
	    level = explosion(level, o2.x, o2.y, 0);
	    level.state.niderite-=2;
	    break;
	case 'ANT':
	    level = explosion(level, o2.x, o2.y, 0);
	    o1.dx*=-1;
	    o1.dy*=-1;
	    break;

	default:
	    o1.dx=0;
	    o1.dy=0;
	}
	break;

    case 'PARTICLE':
	switch(o2.type) {
	case 'WALL':
	    level = explosion(level, o1.x, o1.y, 0);
	    break;

	case 'NIDERITE':
	    level = delete_object(level,o1.id);
	    if(o2.dx==0 && o2.dy==0) {
		level = spawn_object(level,new_particle(o2.x,o2.y,o1.dy,o1.dx), true);
		level = spawn_object(level,new_particle(o2.x,o2.y,-1*o1.dy,-1*o1.dx), true);
	    }
	    break;

	case 'KEY':
	case 'FIRE':
	    level = delete_object(level, o1.id);
	    break;

	case 'PARTICLE':
	    level = explosion(level,o1.x,o1.y,0);
	    break;

	default:
	    level = delete_object(level, o2.id);
	    level = explosion(level, o1.x, o1.y, 0);
	}
	break;

    default:
	level = level;
    }
    return(level);
};

/// DEMO LEVEL ///
load_level = function() {
    return(
	{
	    'objects': [
{'id':1,'type':'WALL','x':10,'y':0,'dx':0,'dy':0,'facing':'left'},
{'id':2,'type':'WALL','x':9,'y':1,'dx':0,'dy':0,'facing':'left'},
{'id':3,'type':'KEY','x':10,'y':1,'dx':0,'dy':0},
{'id':4,'type':'WALL','x':11,'y':1,'dx':0,'dy':0,'facing':'up'},
{'id':5,'type':'WALL','x':9,'y':2,'dx':0,'dy':0,'facing':'right'},
{'id':6,'type':'WALL','x':11,'y':2,'dx':0,'dy':0,'facing':'down'},
{'id':7,'type':'WALL','x':28,'y':2,'dx':0,'dy':0,'facing':'left'},
{'id':8,'type':'WALL','x':29,'y':2,'dx':0,'dy':0,'facing':'right'},
{'id':9,'type':'WALL','x':30,'y':2,'dx':0,'dy':0,'facing':'up'},
{'id':10,'type':'WALL','x':31,'y':2,'dx':0,'dy':0,'facing':'down'},
{'id':11,'type':'WALL','x':32,'y':2,'dx':0,'dy':0,'facing':'left'},
{'id':12,'type':'WALL','x':33,'y':2,'dx':0,'dy':0,'facing':'right'},
{'id':13,'type':'WALL','x':34,'y':2,'dx':0,'dy':0,'facing':'up'},
{'id':14,'type':'WALL','x':5,'y':3,'dx':0,'dy':0,'facing':'up'},
{'id':15,'type':'WALL','x':6,'y':3,'dx':0,'dy':0,'facing':'down'},
{'id':16,'type':'WALL','x':7,'y':3,'dx':0,'dy':0,'facing':'left'},
{'id':17,'type':'WALL','x':8,'y':3,'dx':0,'dy':0,'facing':'right'},
{'id':18,'type':'WALL','x':9,'y':3,'dx':0,'dy':0,'facing':'up'},
{'id':19,'type':'WALL','x':11,'y':3,'dx':0,'dy':0,'facing':'left'},
{'id':20,'type':'WALL','x':12,'y':3,'dx':0,'dy':0,'facing':'right'},
{'id':21,'type':'WALL','x':13,'y':3,'dx':0,'dy':0,'facing':'up'},
{'id':22,'type':'WALL','x':14,'y':3,'dx':0,'dy':0,'facing':'down'},
{'id':23,'type':'WALL','x':15,'y':3,'dx':0,'dy':0,'facing':'left'},
{'id':24,'type':'WALL','x':16,'y':3,'dx':0,'dy':0,'facing':'right'},
{'id':25,'type':'WALL','x':17,'y':3,'dx':0,'dy':0,'facing':'up'},
{'id':26,'type':'WALL','x':27,'y':3,'dx':0,'dy':0,'facing':'left'},
{'id':27,'type':'GUN-D','x':30,'y':3,'dx':0,'dy':0,'count':0, 'maxcount':8},
{'id':28,'type':'WALL','x':35,'y':3,'dx':0,'dy':0,'facing':'left'},
{'id':29,'type':'WALL','x':4,'y':4,'dx':0,'dy':0,'facing':'up'},
{'id':30,'type':'WALL','x':18,'y':4,'dx':0,'dy':0,'facing':'left'},
{'id':31,'type':'WALL','x':19,'y':4,'dx':0,'dy':0,'facing':'right'},
{'id':32,'type':'WALL','x':20,'y':4,'dx':0,'dy':0,'facing':'up'},
{'id':33,'type':'WALL','x':21,'y':4,'dx':0,'dy':0,'facing':'down'},
{'id':34,'type':'WALL','x':22,'y':4,'dx':0,'dy':0,'facing':'left'},
{'id':35,'type':'WALL','x':23,'y':4,'dx':0,'dy':0,'facing':'right'},
{'id':36,'type':'WALL','x':24,'y':4,'dx':0,'dy':0,'facing':'up'},
{'id':37,'type':'WALL','x':25,'y':4,'dx':0,'dy':0,'facing':'down'},
{'id':38,'type':'WALL','x':26,'y':4,'dx':0,'dy':0,'facing':'left'},
{'id':39,'type':'WALL','x':36,'y':4,'dx':0,'dy':0,'facing':'up'},
{'id':40,'type':'WALL','x':3,'y':5,'dx':0,'dy':0,'facing':'up'},
{'id':41,'type':'WALL','x':4,'y':5,'dx':0,'dy':0,'facing':'down'},
{'id':42,'type':'DOOR','x':18,'y':5,'dx':0,'dy':0},
{'id':43,'type':'NIDERITE','x':29,'y':5,'dx':0,'dy':0},
{'id':44,'type':'WALL','x':31,'y':5,'dx':0,'dy':0,'facing':'up'},
{'id':45,'type':'WALL','x':32,'y':5,'dx':0,'dy':0,'facing':'down'},
{'id':46,'type':'NIDERITE','x':34,'y':5,'dx':0,'dy':0},
{'id':47,'type':'WALL','x':36,'y':5,'dx':0,'dy':0,'facing':'down'},
{'id':48,'type':'WALL','x':3,'y':6,'dx':0,'dy':0,'facing':'down'},
{'id':49,'type':'GUN-R','x':4,'y':6,'dx':0,'dy':0,'count':0, 'maxcount':7},
{'id':50,'type':'NIDERITE','x':10,'y':6,'dx':0,'dy':0},
{'id':51,'type':'NIDERITE','x':13,'y':6,'dx':0,'dy':0},
{'id':52,'type':'WALL','x':18,'y':6,'dx':0,'dy':0,'facing':'up'},
{'id':53,'type':'WALL','x':19,'y':6,'dx':0,'dy':0,'facing':'down'},
{'id':54,'type':'WALL','x':20,'y':6,'dx':0,'dy':0,'facing':'left'},
{'id':55,'type':'WALL','x':21,'y':6,'dx':0,'dy':0,'facing':'right'},
{'id':56,'type':'WALL','x':22,'y':6,'dx':0,'dy':0,'facing':'up'},
{'id':57,'type':'WALL','x':23,'y':6,'dx':0,'dy':0,'facing':'down'},
{'id':58,'type':'WALL','x':24,'y':6,'dx':0,'dy':0,'facing':'left'},
{'id':59,'type':'WALL','x':25,'y':6,'dx':0,'dy':0,'facing':'right'},
{'id':60,'type':'WALL','x':26,'y':6,'dx':0,'dy':0,'facing':'up'},
{'id':61,'type':'WALL','x':36,'y':6,'dx':0,'dy':0,'facing':'left'},
{'id':62,'type':'WALL','x':3,'y':7,'dx':0,'dy':0,'facing':'left'},
{'id':63,'type':'WALL','x':4,'y':7,'dx':0,'dy':0,'facing':'right'},
{'id':64,'type':'NIDERITE','x':5,'y':7,'dx':0,'dy':0},
{'id':65,'type':'WALL','x':18,'y':7,'dx':0,'dy':0,'facing':'down'},
{'id':66,'type':'WALL','x':27,'y':7,'dx':0,'dy':0,'facing':'left'},
{'id':67,'type':'WALL','x':28,'y':7,'dx':0,'dy':0,'facing':'right'},
{'id':68,'type':'WALL','x':29,'y':7,'dx':0,'dy':0,'facing':'up'},
{'id':69,'type':'GUN-U','x':31,'y':7,'dx':0,'dy':0,'count':0, 'maxcount':8},
{'id':70,'type':'WALL','x':35,'y':7,'dx':0,'dy':0,'facing':'left'},
{'id':71,'type':'WALL','x':4,'y':8,'dx':0,'dy':0,'facing':'up'},
{'id':72,'type':'WALL','x':10,'y':8,'dx':0,'dy':0,'facing':'left'},
{'id':73,'type':'WALL','x':18,'y':8,'dx':0,'dy':0,'facing':'left'},
{'id':74,'type':'WALL','x':28,'y':8,'dx':0,'dy':0,'facing':'up'},
{'id':75,'type':'WALL','x':29,'y':8,'dx':0,'dy':0,'facing':'down'},
{'id':76,'type':'WALL','x':30,'y':8,'dx':0,'dy':0,'facing':'left'},
{'id':77,'type':'WALL','x':31,'y':8,'dx':0,'dy':0,'facing':'right'},
{'id':78,'type':'WALL','x':32,'y':8,'dx':0,'dy':0,'facing':'up'},
{'id':79,'type':'WALL','x':33,'y':8,'dx':0,'dy':0,'facing':'down'},
{'id':80,'type':'WALL','x':34,'y':8,'dx':0,'dy':0,'facing':'left'},
{'id':81,'type':'WALL','x':4,'y':9,'dx':0,'dy':0,'facing':'down'},
{'id':82,'type':'NIDERITE','x':13,'y':9,'dx':0,'dy':0},
{'id':83,'type':'WALL','x':15,'y':9,'dx':0,'dy':0,'facing':'up'},
{'id':84,'type':'WALL','x':18,'y':9,'dx':0,'dy':0,'facing':'right'},
{'id':85,'type':'WALL','x':22,'y':9,'dx':0,'dy':0,'facing':'right'},
{'id':86,'type':'WALL','x':23,'y':9,'dx':0,'dy':0,'facing':'up'},
{'id':87,'type':'WALL','x':24,'y':9,'dx':0,'dy':0,'facing':'down'},
{'id':88,'type':'WALL','x':5,'y':10,'dx':0,'dy':0,'facing':'right'},
{'id':89,'type':'WALL','x':6,'y':10,'dx':0,'dy':0,'facing':'up'},
{'id':90,'type':'WALL','x':7,'y':10,'dx':0,'dy':0,'facing':'down'},
{'id':91,'type':'WALL','x':8,'y':10,'dx':0,'dy':0,'facing':'left'},
{'id':92,'type':'WALL','x':9,'y':10,'dx':0,'dy':0,'facing':'right'},
{'id':93,'type':'WALL','x':10,'y':10,'dx':0,'dy':0,'facing':'up'},
{'id':94,'type':'WALL','x':11,'y':10,'dx':0,'dy':0,'facing':'down'},
{'id':95,'type':'WALL','x':12,'y':10,'dx':0,'dy':0,'facing':'left'},
{'id':96,'type':'WALL','x':13,'y':10,'dx':0,'dy':0,'facing':'right'},
{'id':97,'type':'WALL','x':14,'y':10,'dx':0,'dy':0,'facing':'up'},
{'id':98,'type':'WALL','x':15,'y':10,'dx':0,'dy':0,'facing':'down'},
{'id':99,'type':'WALL','x':18,'y':10,'dx':0,'dy':0,'facing':'up'},
{'id':100,'type':'WALL','x':19,'y':10,'dx':0,'dy':0,'facing':'down'},
{'id':101,'type':'WALL','x':20,'y':10,'dx':0,'dy':0,'facing':'left'},
{'id':102,'type':'WALL','x':21,'y':10,'dx':0,'dy':0,'facing':'right'},
{'id':103,'type':'WALL','x':22,'y':10,'dx':0,'dy':0,'facing':'up'},
{'id':104,'type':'WALL','x':24,'y':10,'dx':0,'dy':0,'facing':'left'},
{'id':105,'type':'WALL','x':25,'y':10,'dx':0,'dy':0,'facing':'right'},
{'id':106,'type':'WALL','x':26,'y':10,'dx':0,'dy':0,'facing':'up'},
{'id':107,'type':'WALL','x':27,'y':10,'dx':0,'dy':0,'facing':'down'},
{'id':108,'type':'WALL','x':28,'y':10,'dx':0,'dy':0,'facing':'left'},
{'id':109,'type':'WALL','x':2,'y':11,'dx':0,'dy':0,'facing':'down'},
{'id':110,'type':'WALL','x':3,'y':11,'dx':0,'dy':0,'facing':'left'},
{'id':111,'type':'WALL','x':15,'y':11,'dx':0,'dy':0,'facing':'left'},
{'id':112,'type':'NIDERITE','x':28,'y':11,'dx':0,'dy':0},
{'id':113,'type':'WALL','x':29,'y':11,'dx':0,'dy':0,'facing':'up'},
{'id':114,'type':'WALL','x':1,'y':12,'dx':0,'dy':0,'facing':'down'},
{'id':115,'type':'WALL','x':4,'y':12,'dx':0,'dy':0,'facing':'up'},
{'id':116,'type':'WALL','x':15,'y':12,'dx':0,'dy':0,'facing':'right'},
{'id':117,'type':'WALL','x':16,'y':12,'dx':0,'dy':0,'facing':'up'},
{'id':118,'type':'WALL','x':17,'y':12,'dx':0,'dy':0,'facing':'down'},
{'id':119,'type':'WALL','x':18,'y':12,'dx':0,'dy':0,'facing':'left'},
{'id':120,'type':'WALL','x':19,'y':12,'dx':0,'dy':0,'facing':'right'},
{'id':121,'type':'WALL','x':20,'y':12,'dx':0,'dy':0,'facing':'up'},
{'id':122,'type':'WALL','x':21,'y':12,'dx':0,'dy':0,'facing':'down'},
{'id':123,'type':'WALL','x':22,'y':12,'dx':0,'dy':0,'facing':'left'},
{'id':124,'type':'WALL','x':25,'y':12,'dx':0,'dy':0,'facing':'down'},
{'id':125,'type':'WALL','x':26,'y':12,'dx':0,'dy':0,'facing':'left'},
{'id':126,'type':'NIDERITE','x':29,'y':12,'dx':0,'dy':0},
{'id':127,'type':'WALL','x':30,'y':12,'dx':0,'dy':0,'facing':'left'},
{'id':128,'type':'WALL','x':31,'y':12,'dx':0,'dy':0,'facing':'right'},
{'id':129,'type':'WALL','x':32,'y':12,'dx':0,'dy':0,'facing':'up'},
{'id':130,'type':'WALL','x':33,'y':12,'dx':0,'dy':0,'facing':'down'},
{'id':131,'type':'WALL','x':34,'y':12,'dx':0,'dy':0,'facing':'left'},
{'id':132,'type':'WALL','x':35,'y':12,'dx':0,'dy':0,'facing':'right'},
{'id':133,'type':'WALL','x':36,'y':12,'dx':0,'dy':0,'facing':'up'},
{'id':134,'type':'WALL','x':37,'y':12,'dx':0,'dy':0,'facing':'down'},
{'id':135,'type':'WALL','x':1,'y':13,'dx':0,'dy':0,'facing':'left'},
{'id':136,'type':'WALL','x':4,'y':13,'dx':0,'dy':0,'facing':'down'},
{'id':137,'type':'WALL','x':22,'y':13,'dx':0,'dy':0,'facing':'right'},
{'id':138,'type':'WALL','x':25,'y':13,'dx':0,'dy':0,'facing':'left'},
{'id':139,'type':'WALL','x':26,'y':13,'dx':0,'dy':0,'facing':'right'},
{'id':140,'type':'WALL','x':38,'y':13,'dx':0,'dy':0,'facing':'right'},
{'id':141,'type':'WALL','x':1,'y':14,'dx':0,'dy':0,'facing':'right'},
{'id':142,'type':'WALL','x':4,'y':14,'dx':0,'dy':0,'facing':'left'},
{'id':143,'type':'WALL','x':18,'y':14,'dx':0,'dy':0,'facing':'up'},
{'id':144,'type':'WALL','x':19,'y':14,'dx':0,'dy':0,'facing':'down'},
{'id':145,'type':'WALL','x':20,'y':14,'dx':0,'dy':0,'facing':'left'},
{'id':146,'type':'WALL','x':22,'y':14,'dx':0,'dy':0,'facing':'up'},
{'id':147,'type':'DOOR','x':24,'y':14,'dx':0,'dy':0},
{'id':148,'type':'NIDERITE','x':25,'y':14,'dx':0,'dy':0},
{'id':149,'type':'NIDERITE','x':28,'y':14,'dx':0,'dy':0},
{'id':150,'type':'WALL','x':30,'y':14,'dx':0,'dy':0,'facing':'up'},
{'id':151,'type':'WALL','x':31,'y':14,'dx':0,'dy':0,'facing':'down'},
{'id':152,'type':'WALL','x':32,'y':14,'dx':0,'dy':0,'facing':'left'},
{'id':153,'type':'WALL','x':33,'y':14,'dx':0,'dy':0,'facing':'right'},
{'id':154,'type':'WALL','x':34,'y':14,'dx':0,'dy':0,'facing':'up'},
{'id':155,'type':'NIDERITE','x':37,'y':14,'dx':0,'dy':0},
{'id':156,'type':'WALL','x':38,'y':14,'dx':0,'dy':0,'facing':'up'},
{'id':157,'type':'WALL','x':39,'y':14,'dx':0,'dy':0,'facing':'down'},
{'id':158,'type':'WALL','x':1,'y':15,'dx':0,'dy':0,'facing':'up'},
{'id':159,'type':'WALL','x':4,'y':15,'dx':0,'dy':0,'facing':'right'},
{'id':160,'type':'WALL','x':17,'y':15,'dx':0,'dy':0,'facing':'up'},
{'id':161,'type':'WALL','x':21,'y':15,'dx':0,'dy':0,'facing':'up'},
{'id':162,'type':'WALL','x':22,'y':15,'dx':0,'dy':0,'facing':'down'},
{'id':163,'type':'GUN-U','x':23,'y':15,'dx':0,'dy':0,'count':0, 'maxcount':5},
{'id':164,'type':'WALL','x':24,'y':15,'dx':0,'dy':0,'facing':'right'},
{'id':165,'type':'WALL','x':30,'y':15,'dx':0,'dy':0,'facing':'down'},
{'id':166,'type':'WALL','x':34,'y':15,'dx':0,'dy':0,'facing':'down'},
{'id':167,'type':'WALL','x':36,'y':15,'dx':0,'dy':0,'facing':'right'},
{'id':168,'type':'WALL','x':38,'y':15,'dx':0,'dy':0,'facing':'down'},
{'id':169,'type':'ANT','x':39,'y':15,'dx':0,'dy':1},
{'id':170,'type':'WALL','x':40,'y':15,'dx':0,'dy':0,'facing':'right'},
{'id':171,'type':'WALL','x':1,'y':16,'dx':0,'dy':0,'facing':'down'},
{'id':172,'type':'WALL','x':4,'y':16,'dx':0,'dy':0,'facing':'up'},
{'id':173,'type':'WALL','x':17,'y':16,'dx':0,'dy':0,'facing':'down'},
{'id':0,'type':'HERO','x':19,'y':16,'dx':0,'dy':0,'facing':'right'},
{'id':174,'type':'WALL','x':21,'y':16,'dx':0,'dy':0,'facing':'down'},
{'id':175,'type':'WALL','x':22,'y':16,'dx':0,'dy':0,'facing':'left'},
{'id':176,'type':'WALL','x':23,'y':16,'dx':0,'dy':0,'facing':'right'},
{'id':177,'type':'WALL','x':24,'y':16,'dx':0,'dy':0,'facing':'up'},
{'id':178,'type':'ANT','x':25,'y':16,'dx':1,'dy':0},
{'id':179,'type':'WALL','x':30,'y':16,'dx':0,'dy':0,'facing':'left'},
{'id':180,'type':'WALL','x':34,'y':16,'dx':0,'dy':0,'facing':'left'},
{'id':181,'type':'NIDERITE','x':37,'y':16,'dx':0,'dy':0},
{'id':182,'type':'WALL','x':40,'y':16,'dx':0,'dy':0,'facing':'up'},
{'id':183,'type':'WALL','x':1,'y':17,'dx':0,'dy':0,'facing':'left'},
{'id':184,'type':'ANT','x':3,'y':17,'dx':0,'dy':-1},
{'id':185,'type':'WALL','x':4,'y':17,'dx':0,'dy':0,'facing':'down'},
{'id':186,'type':'WALL','x':5,'y':17,'dx':0,'dy':0,'facing':'left'},
{'id':187,'type':'WALL','x':6,'y':17,'dx':0,'dy':0,'facing':'right'},
{'id':188,'type':'WALL','x':7,'y':17,'dx':0,'dy':0,'facing':'up'},
{'id':189,'type':'WALL','x':8,'y':17,'dx':0,'dy':0,'facing':'down'},
{'id':190,'type':'WALL','x':9,'y':17,'dx':0,'dy':0,'facing':'left'},
{'id':191,'type':'WALL','x':14,'y':17,'dx':0,'dy':0,'facing':'right'},
{'id':192,'type':'WALL','x':15,'y':17,'dx':0,'dy':0,'facing':'up'},
{'id':193,'type':'WALL','x':16,'y':17,'dx':0,'dy':0,'facing':'down'},
{'id':194,'type':'WALL','x':17,'y':17,'dx':0,'dy':0,'facing':'left'},
{'id':195,'type':'WALL','x':21,'y':17,'dx':0,'dy':0,'facing':'left'},
{'id':196,'type':'WALL','x':22,'y':17,'dx':0,'dy':0,'facing':'right'},
{'id':197,'type':'WALL','x':23,'y':17,'dx':0,'dy':0,'facing':'up'},
{'id':198,'type':'WALL','x':24,'y':17,'dx':0,'dy':0,'facing':'down'},
{'id':199,'type':'WALL','x':25,'y':17,'dx':0,'dy':0,'facing':'left'},
{'id':200,'type':'WALL','x':26,'y':17,'dx':0,'dy':0,'facing':'right'},
{'id':201,'type':'WALL','x':27,'y':17,'dx':0,'dy':0,'facing':'up'},
{'id':202,'type':'WALL','x':28,'y':17,'dx':0,'dy':0,'facing':'down'},
{'id':203,'type':'WALL','x':29,'y':17,'dx':0,'dy':0,'facing':'left'},
{'id':204,'type':'WALL','x':33,'y':17,'dx':0,'dy':0,'facing':'left'},
{'id':205,'type':'WALL','x':34,'y':17,'dx':0,'dy':0,'facing':'right'},
{'id':206,'type':'WALL','x':37,'y':17,'dx':0,'dy':0,'facing':'left'},
{'id':207,'type':'WALL','x':38,'y':17,'dx':0,'dy':0,'facing':'right'},
{'id':208,'type':'WALL','x':40,'y':17,'dx':0,'dy':0,'facing':'down'},
{'id':209,'type':'WALL','x':1,'y':18,'dx':0,'dy':0,'facing':'right'},
{'id':210,'type':'WALL','x':10,'y':18,'dx':0,'dy':0,'facing':'up'},
{'id':211,'type':'WALL','x':13,'y':18,'dx':0,'dy':0,'facing':'right'},
{'id':212,'type':'GUN-D','x':14,'y':18,'dx':0,'dy':0,'count':0, 'maxcount':5},
{'id':213,'type':'GUN-D','x':16,'y':18,'dx':0,'dy':0,'count':1, 'maxcount':5},
{'id':214,'type':'WALL','x':17,'y':18,'dx':0,'dy':0,'facing':'right'},
{'id':215,'type':'WALL','x':18,'y':18,'dx':0,'dy':0,'facing':'up'},
{'id':216,'type':'NIDERITE','x':19,'y':18,'dx':0,'dy':0},
{'id':217,'type':'WALL','x':20,'y':18,'dx':0,'dy':0,'facing':'left'},
{'id':218,'type':'WALL','x':21,'y':18,'dx':0,'dy':0,'facing':'right'},
{'id':219,'type':'WALL','x':33,'y':18,'dx':0,'dy':0,'facing':'right'},
{'id':220,'type':'WALL','x':36,'y':18,'dx':0,'dy':0,'facing':'left'},
{'id':221,'type':'WALL','x':38,'y':18,'dx':0,'dy':0,'facing':'up'},
{'id':222,'type':'WALL','x':40,'y':18,'dx':0,'dy':0,'facing':'left'},
{'id':223,'type':'WALL','x':1,'y':19,'dx':0,'dy':0,'facing':'up'},
{'id':224,'type':'ANT','x':2,'y':19,'dx':0,'dy':-1},
{'id':225,'type':'WALL','x':4,'y':19,'dx':0,'dy':0,'facing':'right'},
{'id':226,'type':'WALL','x':5,'y':19,'dx':0,'dy':0,'facing':'up'},
{'id':227,'type':'WALL','x':6,'y':19,'dx':0,'dy':0,'facing':'down'},
{'id':228,'type':'WALL','x':7,'y':19,'dx':0,'dy':0,'facing':'left'},
{'id':229,'type':'WALL','x':8,'y':19,'dx':0,'dy':0,'facing':'right'},
{'id':230,'type':'WALL','x':10,'y':19,'dx':0,'dy':0,'facing':'down'},
{'id':231,'type':'WALL','x':11,'y':19,'dx':0,'dy':0,'facing':'left'},
{'id':232,'type':'WALL','x':12,'y':19,'dx':0,'dy':0,'facing':'right'},
{'id':233,'type':'WALL','x':13,'y':19,'dx':0,'dy':0,'facing':'up'},
{'id':234,'type':'WALL','x':17,'y':19,'dx':0,'dy':0,'facing':'up'},
{'id':235,'type':'WALL','x':21,'y':19,'dx':0,'dy':0,'facing':'up'},
{'id':236,'type':'WALL','x':22,'y':19,'dx':0,'dy':0,'facing':'down'},
{'id':237,'type':'WALL','x':23,'y':19,'dx':0,'dy':0,'facing':'left'},
{'id':238,'type':'WALL','x':24,'y':19,'dx':0,'dy':0,'facing':'right'},
{'id':239,'type':'WALL','x':25,'y':19,'dx':0,'dy':0,'facing':'up'},
{'id':240,'type':'WALL','x':26,'y':19,'dx':0,'dy':0,'facing':'down'},
{'id':241,'type':'WALL','x':27,'y':19,'dx':0,'dy':0,'facing':'left'},
{'id':242,'type':'WALL','x':28,'y':19,'dx':0,'dy':0,'facing':'right'},
{'id':243,'type':'WALL','x':29,'y':19,'dx':0,'dy':0,'facing':'up'},
{'id':244,'type':'WALL','x':30,'y':19,'dx':0,'dy':0,'facing':'down'},
{'id':245,'type':'WALL','x':31,'y':19,'dx':0,'dy':0,'facing':'left'},
{'id':246,'type':'WALL','x':32,'y':19,'dx':0,'dy':0,'facing':'right'},
{'id':247,'type':'WALL','x':35,'y':19,'dx':0,'dy':0,'facing':'left'},
{'id':248,'type':'WALL','x':38,'y':19,'dx':0,'dy':0,'facing':'down'},
{'id':249,'type':'WALL','x':40,'y':19,'dx':0,'dy':0,'facing':'right'},
{'id':250,'type':'WALL','x':1,'y':20,'dx':0,'dy':0,'facing':'down'},
{'id':251,'type':'KEY','x':3,'y':20,'dx':0,'dy':0},
{'id':252,'type':'WALL','x':4,'y':20,'dx':0,'dy':0,'facing':'up'},
{'id':253,'type':'WALL','x':8,'y':20,'dx':0,'dy':0,'facing':'up'},
{'id':254,'type':'WALL','x':10,'y':20,'dx':0,'dy':0,'facing':'left'},
{'id':255,'type':'NIDERITE','x':19,'y':20,'dx':0,'dy':0},
{'id':256,'type':'DOOR','x':21,'y':20,'dx':0,'dy':0},
{'id':257,'type':'WALL','x':34,'y':20,'dx':0,'dy':0,'facing':'left'},
{'id':258,'type':'WALL','x':38,'y':20,'dx':0,'dy':0,'facing':'left'},
{'id':259,'type':'KEY','x':39,'y':20,'dx':0,'dy':0},
{'id':260,'type':'WALL','x':40,'y':20,'dx':0,'dy':0,'facing':'up'},
{'id':261,'type':'WALL','x':2,'y':21,'dx':0,'dy':0,'facing':'right'},
{'id':262,'type':'WALL','x':3,'y':21,'dx':0,'dy':0,'facing':'up'},
{'id':263,'type':'WALL','x':8,'y':21,'dx':0,'dy':0,'facing':'down'},
{'id':264,'type':'WALL','x':12,'y':21,'dx':0,'dy':0,'facing':'down'},
{'id':265,'type':'WALL','x':13,'y':21,'dx':0,'dy':0,'facing':'left'},
{'id':266,'type':'WALL','x':14,'y':21,'dx':0,'dy':0,'facing':'right'},
{'id':267,'type':'WALL','x':15,'y':21,'dx':0,'dy':0,'facing':'up'},
{'id':268,'type':'WALL','x':16,'y':21,'dx':0,'dy':0,'facing':'down'},
{'id':269,'type':'WALL','x':17,'y':21,'dx':0,'dy':0,'facing':'left'},
{'id':270,'type':'WALL','x':21,'y':21,'dx':0,'dy':0,'facing':'left'},
{'id':271,'type':'WALL','x':22,'y':21,'dx':0,'dy':0,'facing':'right'},
{'id':272,'type':'WALL','x':23,'y':21,'dx':0,'dy':0,'facing':'up'},
{'id':273,'type':'ANT','x':24,'y':21,'dx':1,'dy':0},
{'id':274,'type':'WALL','x':33,'y':21,'dx':0,'dy':0,'facing':'left'},
{'id':275,'type':'WALL','x':38,'y':21,'dx':0,'dy':0,'facing':'right'},
{'id':276,'type':'WALL','x':39,'y':21,'dx':0,'dy':0,'facing':'up'},
{'id':277,'type':'WALL','x':9,'y':22,'dx':0,'dy':0,'facing':'right'},
{'id':278,'type':'WALL','x':10,'y':22,'dx':0,'dy':0,'facing':'up'},
{'id':279,'type':'WALL','x':11,'y':22,'dx':0,'dy':0,'facing':'down'},
{'id':280,'type':'WALL','x':18,'y':22,'dx':0,'dy':0,'facing':'up'},
{'id':281,'type':'WALL','x':19,'y':22,'dx':0,'dy':0,'facing':'down'},
{'id':282,'type':'WALL','x':20,'y':22,'dx':0,'dy':0,'facing':'left'},
{'id':283,'type':'WALL','x':24,'y':22,'dx':0,'dy':0,'facing':'left'},
{'id':284,'type':'WALL','x':25,'y':22,'dx':0,'dy':0,'facing':'right'},
{'id':285,'type':'WALL','x':26,'y':22,'dx':0,'dy':0,'facing':'up'},
{'id':286,'type':'WALL','x':27,'y':22,'dx':0,'dy':0,'facing':'down'},
{'id':287,'type':'WALL','x':28,'y':22,'dx':0,'dy':0,'facing':'left'},
{'id':288,'type':'WALL','x':29,'y':22,'dx':0,'dy':0,'facing':'right'},
{'id':289,'type':'WALL','x':30,'y':22,'dx':0,'dy':0,'facing':'up'},
{'id':290,'type':'WALL','x':31,'y':22,'dx':0,'dy':0,'facing':'down'},
{'id':291,'type':'WALL','x':32,'y':22,'dx':0,'dy':0,'facing':'left'}
],
	    'state':{'keys' : 0, 'niderite' : 14}
	});
};


/// GAMELOOP TOTAL WIESZ ///
var joystick={dx:0,dy:0}; /// joystick from keyboard ;)

reset_joystick = function() {
    joystick.dx = 0;
    joystick.dy = 0;
};

window.addEventListener('keydown',
			function(evt) {
			    if(evt.keyCode==37) {joystick.dx=-1; joystick.dy=0;} // left arrow 37
			    if(evt.keyCode==39) {joystick.dx=1; joystick.dy=0;}  // right arrow 39
			    if(evt.keyCode==38) {joystick.dy=-1; joystick.dx=0; evt.preventDefault();}
			    if(evt.keyCode==40) {joystick.dy=1; joystick.dx=0; evt.preventDefault();}
			},
			false);


var vcx = 0;
var vcy = 0;
var anim_frame=0; /// !!!

draw_level = function(level,fade) {
    anim_frame++;
    anim_frame%=2;
    var tile_w=48;
    var tile_h=48;
    var offset_x=23+(6-Math.min(6,fade))*tile_w;
    var offset_y=99+(4-Math.min(4,fade))*tile_h;
    var viewport_dw=Math.min(6,fade);
    var viewport_dh=Math.min(4,fade);
    var hero = find_by_id(level, 0);
    if(hero!=null) {
	vcx=hero.x;
	vcy=hero.y;
    }
    var viewport_center_x=vcx;
    var viewport_center_y=vcy;

    var x=offset_x,y=offset_y;
    kontekst.drawImage(Background,0,0);
//    if(fade<=0) return;

    for(var j=viewport_center_y-viewport_dh;j<=viewport_center_y+viewport_dh;j++) {
	for(var i=viewport_center_x-viewport_dw;i<=viewport_center_x+viewport_dw;i++) {
	    var o=find_by_pos(level,i,j);
	    if(o!=null) {
		var sprite=Sprites[o.type];
		if(o.type=='PARTICLE') {
		    sprite=sprite[anim_frame];
		} else if(o.type == 'ANT') {
		    if(o.dx>0) sprite = sprite['right'];
		    else if(o.dy<0) sprite = sprite['up'];
		    else if(o.dy>0) sprite = sprite['down'];
		    else sprite = sprite['left'];
		} else if(o.type=='WALL' || o.type== 'HERO') {
		    sprite=sprite[o.facing];
		}
		kontekst.drawImage(sprite,x,y);
	    }
	    x+=tile_w;
	}
	x=offset_x;
	y+=tile_h;
    }

};


var level = load_level();
var game_state = 'FADE_IN';
var fade_count = 0;
var MAX_FADE_COUNT = 7;

setInterval(function(){ 

    switch(game_state) {
    case 'FADE_IN':
	draw_level(level,fade_count);
	if(++fade_count>=MAX_FADE_COUNT) game_state='PLAY';
	break;

    case 'FADE_OUT':
	draw_level(level,fade_count);
	if(--fade_count<=0) {
	    level = load_level();
	    game_state='FADE_IN';
	}
	break;

    case 'FADE_OUT_WON':
	draw_level(level,fade_count);
	if(--fade_count<=0) {
	    level = load_level();
	    game_state='WON';
	}
	break;

    case 'WON':
	kontekst.drawImage(Background,0,0);
	kontekst.drawImage(Msg,23+2*48,99+3*48);	
	break;

	
    case 'PLAY':
	var dx=joystick.dx;
	var dy=joystick.dy;    
	reset_joystick();
	if(dx!=0 || dy!=0) {
	    var hero = find_by_id(level, 0);
	    hero.dx = dx;
	    hero.dy = dy;
	    hero.facing=get_facing2(hero.facing,dx,dy);
	    level = update_object(level, hero.id, hero);
	}
	for(var i=0;i<level.objects.length;i++) {
	    var object = level.objects[i];
	    var deleted = false;
	    if(object == null) continue;	
	    if(typeof object.expires == 'number') {
		if(object.expires == 0) {
		    level = delete_object(level, object.id);
		    deleted = true;
		} else {
		    object.expires--;
		    level = update_object(level, object.id, object);
		}
	    }
	    if(typeof object.count == 'number') {
		if(object.count == 0) {
		    switch(object.type) {
		    case 'GUN-L':
			var x = object.x, y=object.y;
			var dx = -1, dy = 0;
			level = spawn_object(level, new_particle(x,y,dx,dy), true);
			break;
		    case 'GUN-R':	
			var x = object.x, y=object.y;
			var dx = 1, dy = 0;
			level = spawn_object(level, new_particle(x,y,dx,dy), true);
			break;	   
		case 'GUN-U':	
			var x = object.x, y=object.y;
			var dx = 0, dy = -1;
			level = spawn_object(level, new_particle(x,y,dx,dy), true);
			break;	   
		case 'GUN-D':	
			var x = object.x, y=object.y;
			var dx = 0, dy = 1;
			level = spawn_object(level, new_particle(x,y,dx,dy), true);
			break;	   
		}	
		    object.count = object.maxcount;
		} else {
		    object.count--;
		}
		level = update_object(level, object.id, object);
	    }
	    if(deleted || (object.dx == 0 && object.dy == 0)) continue;
	    var nx = object.x + object.dx;
	    var ny = object.y + object.dy;
	    level = move_object(level, object.id, nx, ny);
	}
	level = clean_up(level);
	draw_level(level,MAX_FADE_COUNT);
	if(level.state.niderite<=0) {
	    game_state='FADE_OUT_WON';
	}
	var hero = find_by_id(level, 0);
	if(hero == null) {
	    game_state='FADE_OUT';
	    //// level = load_level();
	} else {
	    hero.dx = 0;
	    hero.dy = 0;
	    level = update_object(level, hero.id, hero);
	}
	break;	
    }
},172);
