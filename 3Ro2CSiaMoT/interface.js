/// INPUT /////////////////////////////////////////////////////
var joystick={dx:0,dy:0}; /// a joystick, right ;)

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


/// OUTPUT

var screen_w=672, screen_h=576;
//var screen_w=823, screen_h=600;
var kanwa=document.getElementById("ekraniszcze");
var kontekst=kanwa.getContext("2d");

var load_sound = function(url,max) {
    var smpls = [];
    for(var i=0;i<max;i++) {
	smpls.push(new Audio(url));
    }
    return {"samples":smpls,"index":0,"max":max};
};


var Sounds = {
    // 'low-chord-dtn' : load_sound('snd/low-chord-dtn.ogg',1),
    //'push' : load_sound('snd/push.ogg',4), 
    'death' : load_sound('snd/death.ogg',1),
    'pipe' : load_sound('snd/pipe.ogg',2),
    'squeak-high' : load_sound('snd/squeak-high.ogg',2),
    'squeak-low' : load_sound('snd/squeak-low.ogg',2),
    's-2' : load_sound('snd/s-2.ogg',8),
    's-1' : load_sound('snd/s-1.ogg',16),
    's1' : load_sound('snd/s1.ogg',8),
    's2' : load_sound('snd/s2.ogg',8),
    's3' : load_sound('snd/s3.ogg',8),
    's4' : load_sound('snd/s4.ogg',6),
    'short-high-chord' : load_sound('snd/short-high-chord.ogg',4)
};

var PLAY=function(type,vol) {
    var s = Sounds[type];
    s.index = ++s.index%s.max;
    snd = s.samples[s.index];
    snd.volume = vol;
    snd.play();
};

var load_image = function(url){
    var i=new Image();
    i.src=url;
    return(i);
};  

//var Background = load_image('img/background.png');

var Sprites = {

    'HERO-SQUARE' : {'up' : [ load_image('img/hero-square-up.png'),
			      load_image('img/hero-square2-up.png'),
			      load_image('img/hero-square3-up.png') ],
		     'down' : [ load_image('img/hero-square-down.png'),
				load_image('img/hero-square2-down.png'),
				load_image('img/hero-square3-down.png') ],
		     'up2' : [ load_image('img/hero-square-up2.png'),
			       load_image('img/hero-square2-up2.png'),
			       load_image('img/hero-square3-up2.png') ],
		     'down2' : [ load_image('img/hero-square-down2.png'),
				 load_image('img/hero-square2-down2.png'),
				 load_image('img/hero-square3-down2.png') ],
		     'left' : [ load_image('img/hero-square-left.png'),
				load_image('img/hero-square2-left.png'),
				load_image('img/hero-square3-left.png') ],
		     'right' : [ load_image('img/hero-square-right.png'),
				 load_image('img/hero-square2-right.png'),
				 load_image('img/hero-square3-right.png') ]
		    },

    'HERO-TRIANGLE' : {'up' : [ load_image('img/hero-triangle-up.png'),
				load_image('img/hero-triangle2-up.png'),
				load_image('img/hero-triangle3-up.png') ],
		       'down' : [ load_image('img/hero-triangle-down.png'),
				  load_image('img/hero-triangle2-down.png'),
				  load_image('img/hero-triangle3-down.png') ],
		       'up2' : [ load_image('img/hero-triangle-up2.png'),
				 load_image('img/hero-triangle2-up2.png'),
				 load_image('img/hero-triangle3-up2.png') ],
		       'down2' : [ load_image('img/hero-triangle-down2.png'),
				   load_image('img/hero-triangle2-down2.png'),
				   load_image('img/hero-triangle3-down2.png') ],
		       'left' : [ load_image('img/hero-triangle-left.png'),
				  load_image('img/hero-triangle2-left.png'),
				  load_image('img/hero-triangle3-left.png') ],
		       'right' : [ load_image('img/hero-triangle-right.png'),
				   load_image('img/hero-triangle2-right.png'),
				   load_image('img/hero-triangle3-right.png') ]
		      },

    'HERO-DISK' : {'up' : [ load_image('img/hero-disk-up.png'),
			    load_image('img/hero-disk2-up.png'),
			    load_image('img/hero-disk3-up.png') ],
		   'down' : [ load_image('img/hero-disk-down.png'),
			      load_image('img/hero-disk2-down.png'),
			      load_image('img/hero-disk3-down.png') ],
		   'up2' : [ load_image('img/hero-disk-up2.png'),
			     load_image('img/hero-disk2-up2.png'),
			     load_image('img/hero-disk3-up2.png') ],
		   'down2' : [ load_image('img/hero-disk-down2.png'),
			       load_image('img/hero-disk2-down2.png'),
			       load_image('img/hero-disk3-down2.png') ],
		   'left' : [ load_image('img/hero-disk-left.png'),
			      load_image('img/hero-disk2-left.png'),
			      load_image('img/hero-disk3-left.png') ],
		   'right' : [ load_image('img/hero-disk-right.png'),
			       load_image('img/hero-disk2-right.png'),
			       load_image('img/hero-disk3-right.png') ]
		  },

    'BLANK' : [ load_image('img/blank.png'),
    	      	load_image('img/letters/space2.png'),
		load_image('img/letters/space.png') ],

    'SQUARE' : [ load_image('img/square.png'),
		 load_image('img/square3.png'),
		 load_image('img/square2.png') ],
    'TRIANGLE' : [ load_image('img/triangle.png'),
		   load_image('img/triangle2.png') ],
    'DISK' : [ load_image('img/disk.png'),
	       load_image('img/disk3.png'),
	       load_image('img/disk2.png') ],

    'HOLE-SQUARE' : [ load_image('img/hole-square.png'),
		      load_image('img/hole-square3.png'),
		      load_image('img/hole-square2.png') ],
    'HOLE-TRIANGLE' : [ load_image('img/hole-triangle.png'),
			load_image('img/hole-triangle2.png') ],
    'HOLE-DISK' : [ load_image('img/hole-disk.png'),
		    load_image('img/hole-disk2.png'),
		    load_image('img/hole-disk3.png') ],

    'WALL': [ load_image('img/wall-up.png'),
	      load_image('img/wall-right2.png'),
	      load_image('img/wall-left.png') ],

    'DOOR': [ load_image('img/door.png'),
	      load_image('img/door2.png') ],
    'KEY': [ load_image('img/key.png'),
	     load_image('img/key2.png') ],

    'MACHINE': [ load_image('img/machine.png'),
		 load_image('img/machine2.png') ],

    'PIPE-H': [ load_image('img/pipe-left.png'),
		load_image('img/pipe-left2.png'),
		load_image('img/pipe-right.png'),
		load_image('img/pipe-right2.png')],

    'PIPE-V': [ load_image('img/pipe-down.png'),
		load_image('img/pipe-down2.png'),
		load_image('img/pipe-up.png'),
		load_image('img/pipe-up2.png')],

    'TURNCOCK-H': [ load_image('img/turncock-h.png'),
    		    load_image('img/turncock-h2.png')],
    'TURNCOCK-V': [ load_image('img/turncock-v.png'),
		    load_image('img/turncock-v2.png')],

    'PIPE-DL': load_image('img/pipe-dl.png'),
    'PIPE-DR': load_image('img/pipe-dr.png'),
    'PIPE-UL': load_image('img/pipe-ul.png'),
    'PIPE-UR': load_image('img/pipe-ur.png'),

    'BOOM': load_image('img/boom.png')

};

var Letters = {
    ' ' : [load_image('img/letters/space.png'),load_image('img/letters/space2.png')], 
    'a' : [load_image('img/letters/a.png'),load_image('img/letters/a2.png')], 
    'b' : [load_image('img/letters/b.png'),load_image('img/letters/b2.png')], 
    'c' : [load_image('img/letters/c.png'),load_image('img/letters/c2.png')], 
    'd' : [load_image('img/letters/d.png'),load_image('img/letters/d2.png')], 
    'e' : [load_image('img/letters/e.png'),load_image('img/letters/e2.png')], 
    'f' : [load_image('img/letters/f.png'),load_image('img/letters/f2.png')], 
    'g' : [load_image('img/letters/g.png'),load_image('img/letters/g2.png')], 
    'h' : [load_image('img/letters/h.png'),load_image('img/letters/h2.png')], 
    'i' : [load_image('img/letters/i.png'),load_image('img/letters/i2.png')], 
    'j' : [load_image('img/letters/j.png'),load_image('img/letters/j2.png')], 
    'k' : [load_image('img/letters/k.png'),load_image('img/letters/k2.png')], 
    'l' : [load_image('img/letters/l.png'),load_image('img/letters/l2.png')], 
    'm' : [load_image('img/letters/m.png'),load_image('img/letters/m2.png')], 
    'n' : [load_image('img/letters/n.png'),load_image('img/letters/n2.png')], 
    'o' : [load_image('img/letters/o.png'),load_image('img/letters/o2.png')], 
    'p' : [load_image('img/letters/p.png'),load_image('img/letters/p2.png')], 
    'q' : [load_image('img/letters/q.png'),load_image('img/letters/q2.png')], 
    'r' : [load_image('img/letters/r.png'),load_image('img/letters/r2.png')], 
    's' : [load_image('img/letters/s.png'),load_image('img/letters/s2.png')], 
    't' : [load_image('img/letters/t.png'),load_image('img/letters/t2.png')], 
    'u' : [load_image('img/letters/u.png'),load_image('img/letters/u2.png')], 
    'v' : [load_image('img/letters/v.png'),load_image('img/letters/v2.png')], 
    'w' : [load_image('img/letters/w.png'),load_image('img/letters/w2.png')], 
    'x' : [load_image('img/letters/x.png'),load_image('img/letters/x2.png')], 
    'y' : [load_image('img/letters/y.png'),load_image('img/letters/y2.png')], 
    'z' : [load_image('img/letters/z.png'),load_image('img/letters/z2.png')],
    '!' : [load_image('img/letters/excl.png'),load_image('img/letters/excl2.png')], 
    '-' : [load_image('img/letters/hyphen.png'),load_image('img/letters/hyphen2.png')], 
    '.' : [load_image('img/letters/period.png'),load_image('img/letters/period2.png')], 
    '\'' : [load_image('img/letters/quot.png'),load_image('img/letters/quot2.png')], 
    /// I forgot to draw a question mark.
    '*' : [load_image('img/letters/circ.png'),load_image('img/letters/circ2.png')], 
    '^' : [load_image('img/letters/delta.png'),load_image('img/letters/delta2.png')], 
    '#' : [load_image('img/letters/sq.png'),load_image('img/letters/sq2.png')]
};

var vcx = 0;
var vcy = 0;
var anim_frame=0;

var draw_board = function(world,status,msg,fade) {
    anim_frame++;
    anim_frame%=3;
    var tile_w=32, tile_h=32;
    var offset_x=rand(0,1), offset_y=rand(0,1);
    var viewport_dw=10, viewport_dh=8;

    var hero = find_hero(world);
    if(hero!=null) {
	vcx=hero.x;
	vcy=hero.y;
    }
    var viewport_center_x=vcx;
    var viewport_center_y=vcy;
    //kontekst.drawImage(Background,0,0);
    //kontekst.fillStyle="#FFFFFF";
    //kontekst.fillRect(0,0,screen_w,screen_h);

    var x=offset_x,y=offset_y;
    for(var j=viewport_center_y-viewport_dh;j<=viewport_center_y+viewport_dh;j++) {
	for(var i=viewport_center_x-viewport_dw;i<=viewport_center_x+viewport_dw;i++) {
	    var o=find_by_pos(the_world,i,j);
	    var sprite=Sprites['BLANK'][rand(0,2)]; // :)
	    if(o!=null && y<=fade*tile_h) {
		sprite=Sprites[o.type];
		switch(o.type) {
		case 'WALL':
		case 'SQUARE':
		case 'DISK':
		case 'HOLE-SQUARE':
		case 'HOLE-DISK':
		    sprite=sprite[rand(0,2)]; // !!
		    break;
		case 'PIPE-H':
		case 'PIPE-V':
		    sprite=sprite[rand(0,3)];
		    break;
		case 'TRIANGLE':
		case 'HOLE-TRIANGLE':
		case 'MACHINE':
		case 'DOOR':
		case 'KEY':
		case 'TURNCOCK-H':
		case 'TURNCOCK-V':
		    sprite=sprite[rand(0,1)/* anim_frame*/];
		    break;
		case 'HERO-SQUARE':
		case 'HERO-TRIANGLE':
		case 'HERO-DISK':
		    sprite=sprite[o.facing][anim_frame]; // !!
		    break;
		}
		//kontekst.drawImage(sprite,x,y);		
	    }
	    kontekst.drawImage(sprite,x,y);
	    x+=tile_w;
	}
	x=offset_x;
	y+=tile_h;
    }

    if(status!=null) {
	/// statusbar        
	for(var i=0;i<status.lives;i++) {
    	    kontekst.drawImage(Sprites[hero.type].right[rand(1,2)],x,y);
	    x+=tile_w;
	}
	kontekst.drawImage(Sprites['BLANK'][1],x,y); x+=tile_w;
	/// !!!!!!
	for(var i=0;i<hero.inventory.length;i++) {
	    kontekst.drawImage(Sprites['KEY'][rand(0,1)],x,y);
	    x+=tile_w;
	} /// \!!!!!
	kontekst.drawImage(Sprites['BLANK'][rand(1,2)],x,y); x+=tile_w;
	for(var i=0;i<status.squares;i++) {
	    sprite = Sprites['SQUARE'][rand(0,2)];
    	    kontekst.drawImage(sprite,x,y);
	    x+=tile_w;
	}
	kontekst.drawImage(Sprites['BLANK'][rand(1,2)],x,y); x+=tile_w;
	for(var i=0;i<status.triangles;i++) {
	    sprite = Sprites['TRIANGLE'][rand(0,1)];
    	    kontekst.drawImage(sprite,x,y);
	    x+=tile_w;
	}
	kontekst.drawImage(Sprites['BLANK'][rand(1,2)],x,y); x+=tile_w;
	for(var i=0;i<status.disks;i++) {
	    sprite = Sprites['DISK'][rand(0,2)];
    	    kontekst.drawImage(sprite,x,y);
	    x+=tile_w;
	}    
    }
    while(x<screen_w) {
	kontekst.drawImage(Sprites['BLANK'][rand(1,2)],x,y);
	x+=tile_w;
    }

    /// aa, message!
    msg = msg.toLowerCase();
    var mx = ((2*viewport_dw+1)-msg.length)/2;
    for(var i=0;i<msg.length;i++) {
	kontekst.drawImage(Letters[msg[i]][rand(0,1)],
			   offset_x+tile_w*(mx+i),
			   offset_y+tile_w*(viewport_dh-1));
    }
};


/// MAIN //////////////////////////////////////////////////////

/// yeah, whatever.
var _max_lives_ = 5; /// ??
var lives = _max_lives_;
var level = 0;
var message = {'text':'', 'expires':0};
var the_world = {};
var GAME_STATE = 'TITLE';
var _fadin_ = 0;
var _max_fadin_ = 17;
var _min_fadin_ = -2;

var init_level = function(n) {
    level = n;
    message = {'text':'get ready!', 'expires':18};
    the_world = load_level(n);
    GAME_STATE = 'FADE IN';
    _fadin_ = _min_fadin_;
};



var do_play = function() {
    var game_stats = count_shapes(the_world);
    game_stats.lives = lives; // !!
    
    /// HAHA! MAYBE THIS LEVEL IS ALREADY SOLVED? <- a fine place do check that! [not really]
    if(game_stats.squares==0
       && game_stats.disks==0
       && game_stats.triangles==0) {
	GAME_STATE = 'FADE OUT levelup';
	PLAY('short-high-chord',0.99);
    }

    /// show the world
    draw_board(the_world,game_stats,((message.expires-->0)?message.text:''),_max_fadin_);
    /// get some feedback
    var dx=joystick.dx;
    var dy=joystick.dy;    
    reset_joystick();
    /// apply to the only protagonist
    var hero = find_hero(the_world);
    hero.dx = dx; hero.dy = dy;
    if(dx!=0 || dy!=0) {
	PLAY('s-1',0.9-0.23*Math.random());
	hero.facing=new_facing(hero.facing,dx,dy);
    }
    the_world = update_thing(the_world, hero);
    /// and see what happens
    the_world = world_step(the_world);

    /// and do the sound FX / messages stuff!
    for(var i=0;i<the_world.facts.length;i++) {
	var fact = the_world.facts[i];
	var vol = 0.9-0.13*Math.random();
	switch(fact[0]) {
	case 'SHIFT TO':
	    if(messages.expires<=0) {
		message.text='SHIFT!';
		message.expires=2;
	    }
	    vol=1.0;
	case 'PUSHED':
	    switch(fact[2]) {
	    case 'SQUARE': PLAY('s1',vol); break;
	    case 'DISK': PLAY('s2',vol); break;
	    case 'TRIANGLE': PLAY('s3',vol); break;
	    //default: PLAY('push',vol); break; // pff...
	    }
	    break;
	case 'ANNIHILATE':
	    switch(rand(1,3)) {
	    case 1: message.text='GOOD!'; break;
	    case 2: message.text='COOL!'; break;
	    case 3: message.text='well done.'; break;
	    }
	    message.expires=2;
	    PLAY('short-high-chord',vol);
	    break;

	case 'TELEPORT':
	    if(message.expires<=0) {
		switch(rand(1,3)) {
		case 1: message.text='WHOA!'; break;
		case 2: message.text='WOW!'; break;
		case 3: message.text='WEE!'; break;
		}
		message.expires=2;
	    }
	    PLAY('pipe',vol);
	    break;

	case 'TURNCOCK':
	    PLAY('squeak-high',1.0);
	    message.text='turned the turncock';
	    message.expires=4;
	    break;
	case 'PICKUP':
	    message.text="you've got a key now";
	    message.expires=5;
	    PLAY('s4',vol);
	    break;
	case 'OPENED':
	    message.text='the door ulocks';
	    message.expires=4;
	    PLAY('s4',vol);
	    break;
	case 'FAILED TO OPEN':
	    message.text="it's locked";
	    message.expires=4;
	    PLAY('s-2',vol); break;	    

	case 'FAILED TO PUSH':
	    message.text="can't do that";
	    message.expires=4;
	    PLAY('s-2',vol); break;	    

	case "NO UNSHIFTIN":
	    message.text="can't unshift further";
	    message.expires=5;
	    PLAY('s-2',vol); break;	    

	case 'THIS PIPE IS CLOSED':
	    switch(rand(1,2)) {
	    case 1: message.text="can't do that";break;
	    case 2: message.text='find a turncock';break;
	    }
	    message.expires=4;
	    PLAY('s-2',vol); break;

	case 'DIES':
	    switch(rand(1,2)) {
	    case 1: message.text = 'YOU DIE!'; break;
	    case 2: message.text = 'OOPS... YOU DIE.'; break;
	    }
	    message.expires = 16;
	    PLAY('death',1.0);
	    _faind_ = _max_fadin_-1;
	    GAME_STATE = 'FADE OUT death';
	    break;
	}
    }
};


var do_fadein = function() {
    var game_stats = count_shapes(the_world);
    game_stats.lives = lives; // !!
    draw_board(the_world,game_stats,((message.expires-->0)?message.text:''),_fadin_);
    if(++_fadin_ >= _max_fadin_) {
	GAME_STATE = 'PLAY';
    }
};

var do_fadeout_death = function() {
    var game_stats = {'squares':0,'triangles':0,'discs':0, 'lives':lives-(_fadin_%2)};
    draw_board(the_world,game_stats,((message.expires-->0)?message.text:''),_fadin_);
    hero = find_hero(the_world);
    switch(mod(_fadin_,4)) {
    case 0: hero.facing = 'right'; break;
    case 1: hero.facing = 'down'; break;
    case 2: hero.facing = 'left'; break;
    case 3: hero.facing = 'up2'; break;
    }
    if(_fadin_-- <= 0) {
	if(--lives<=0) {
	    GAME_STATE = 'GAME OVER';
	}
	else {
	    init_level(level);
	    _fadin_ = _min_fadin_;
	    GAME_STATE = 'FADE IN';
	}
    }
};

var do_fadeout_levelup = function() {
    draw_board(the_world,null,'LEVEL COMPLETE.',_fadin_);
    hero = find_hero(the_world);
    switch(mod(_fadin_,4)) {
    case 0: hero.facing = 'right'; break;
    case 1: hero.facing = 'down'; break;
    case 2: hero.facing = 'left'; break;
    case 3: hero.facing = 'up2'; break;
    }
    if(_fadin_-- <= 0) {
	level++;
	if(level>1) {
	    GAME_STATE = 'VICTOLY';
	} else {
	    init_level(level);
	    _fadin_ = _min_fadin_;
	    GAME_STATE = 'FADE IN';
	}
    }
};



var do_title = function() {

    /// TODO
    init_level(0);
    GAME_STATE = 'FADE IN';
};

var do_gameover = function() {
    the_world = mk_world([],2,3);
    draw_board(the_world,null,'GAME OVER.',0);
    if(++_fadin_>= 33) {
	GAME_STATE = 'TITLE';
    }
};

var do_help = function () {
    /// TODO!!!
};

var do_victoly = function() {
    var fcng = (++_fadin_%2?'left':'right');
    if(_fadin_==3) PLAY('s-2',0.33);
    if(_fadin_==6) PLAY('s-1',0.33);
    if(_fadin_==8) _fadin_=0;

    the_world = mk_world([{'type':'HERO-SQUARE','x':4,'y':0,'facing':fcng},
			  {'type':'HERO-TRIANGLE','x':2,'y':0,'facing':fcng},
			  {'type':'HERO-DISK','x':6,'y':0,'facing':fcng}],33,23);
    draw_board(the_world,null,'YOU WON!!!',33);
    

};

var Game_states_step = {
    'PLAY': do_play,
    'FADE IN': do_fadein,
    'FADE OUT death': do_fadeout_death,
    'FADE OUT levelup': do_fadeout_levelup,
    'GAME OVER': do_gameover,
    'HELP': do_help,    
    'VICTOLY': do_victoly,
    'TITLE': do_title
};


setInterval(function() { Game_states_step[GAME_STATE](); },143); /// ~7Hz -- like brain in a dreamstate.
