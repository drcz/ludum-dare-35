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

var screen_w=608, screen_h=480;
var kanwa=document.getElementById("ekraniszcze");
var kontekst=kanwa.getContext("2d");

var load_sound = function(url) {
    return new Audio(url);
};

var Sounds = {
    'beep' : load_sound('snd/beep.ogg')
    /// TODO
};

var PLAY=function(type,vol) {
    var snd=Sounds[type];
    snd.volume=vol;
    snd.play();
};

var load_image = function(url){
    var i=new Image();
    i.src=url;
    return(i);
};  

var Sprites = {
    'BLANK' : load_image('img/blank.png'),

    'HERO-SQUARE' : load_image('img/hero-square.png'),
    'HERO-TRIANGLE' : load_image('img/hero-triangle.png'),
    'HERO-DISK' : load_image('img/hero-disk.png'),
    'SQUARE' : load_image('img/square.png'),
    'TRIANGLE' : load_image('img/triangle.png'),
    'DISK' : load_image('img/disk.png'),
    'HOLE-SQUARE' : load_image('img/hole-square.png'),
    'HOLE-TRIANGLE' : load_image('img/hole-triangle.png'),
    'HOLE-DISK' : load_image('img/hole-disk.png'),
    'WALL': load_image('img/wall.png'), // ?
    'BOOM': load_image('img/boom.png'),
    'DOOR': load_image('img/door.png'),
    'KEY': load_image('img/key.png'),
    'MACHINE': load_image('img/machine.png'),
    'PIPE-DL': load_image('img/pipe-dl.png'),
    'PIPE-DR': load_image('img/pipe-dr.png'),
    'PIPE-H': load_image('img/pipe-h.png'),
    'PIPE-UL': load_image('img/pipe-ul.png'),
    'PIPE-UR': load_image('img/pipe-ur.png'),
    'PIPE-V': load_image('img/pipe-v.png'),
    'TURNCOCK-H': load_image('img/turncock-h.png'),
    'TURNCOCK-V': load_image('img/turncock-v.png')
    /// bomb, detonator...
    /*			 
			 ,
    'HERO' : {'SQUARE':load_image('img/hero-square.png'),
	      'TRIANGLE':load_image('img/hero-triangle.png'),
	      'DISK':load_image('img/hero-disk.png'),
	      'NORMAL':load_image('img/hero-normal.png')},

			 'GUN' : {'up':load_image('img/gun-up.png'),
			 'down':load_image('img/gun-down.png'),
			 'left':load_image('img/gun-left.png'),
			 'right':load_image('img/gun-right.png')},
			 'PARTICLE': [load_image('img/particle.png'),load_image('img/particle2.png')],
			 'ANT': {'up':load_image('img/ant-up.png'),
			 'down':load_image('img/ant-down.png'),
			 'left':load_image('img/ant-left.png'),
			 'right':load_image('img/ant-right.png')}
    */

};

var vcx = 0;
var vcy = 0;
var anim_frame=0;

var draw_board = function(world,fade) {
    fade = 66; // i chuj.
    anim_frame++;
    anim_frame%=2;
    var tile_w=32;
    var tile_h=32;
    var offset_x=0;//23+(6-Math.min(6,fade))*tile_w;
    var offset_y=0;//99+(4-Math.min(4,fade))*tile_h;
    var viewport_dw=Math.min(9,fade);
    var viewport_dh=Math.min(7,fade);
    var hero = find_hero(world);
    if(hero!=null) {
	vcx=hero.x;
	vcy=hero.y;
    }
    var viewport_center_x=vcx;
    var viewport_center_y=vcy;

    kontekst.fillStyle="#FFFFFF";
    kontekst.fillRect(0,0,screen_w,screen_h);

    var x=offset_x,y=offset_y;
    for(var j=viewport_center_y-viewport_dh;j<=viewport_center_y+viewport_dh;j++) {
	for(var i=viewport_center_x-viewport_dw;i<=viewport_center_x+viewport_dw;i++) {
	    var o=find_by_pos(the_world,i,j);
	    var sprite=Sprites['BLANK'];
	    if(o!=null) {
		sprite=Sprites[o.type];
		/*
		if(o.type=='PARTICLE') {
		    sprite=sprite[anim_frame];
		} else if(o.type == 'ANT') {
		    if(o.dx>0) sprite = sprite['right'];
		    else if(o.dy<0) sprite = sprite['up'];
		    else if(o.dy>0) sprite = sprite['down'];
		    else sprite = sprite['left'];
		} else if(o.type=='WALL' || o.type== 'HERO' || o.type=='GUN') {
		    sprite=sprite[o.facing];
		}
		*/
	    }
	    kontekst.drawImage(sprite,x,y);
	    x+=tile_w;
	}
	x=offset_x;
	y+=tile_h;
    }
};


/// MAIN //////////////////////////////////////////////////////

var the_world = load_level(1);

setInterval(function() { 
    
//    if(the_world.facts.length>0) PLAY('beep',0.9); /// OK DZIAŁA.
    draw_board(the_world,7);
    var dx=joystick.dx;
    var dy=joystick.dy;    
    reset_joystick();
    var hero = find_hero(the_world);
    hero.dx = dx;
    hero.dy = dy;
    if(dx!=0 || dy!=0) {
	//hero.facing=new_facing(hero.facing,dx,dy);
    }
    the_world = update_thing(the_world, hero);
    the_world = world_step(the_world);

},123);