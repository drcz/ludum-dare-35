/// dear js, you are weird :)
var clone_obj = function(obj) {
    var keys = Object.keys(obj);
    var new_obj = {};
    for(var k=0;k<keys.length;k++) {
	new_obj[keys[k]] = obj[keys[k]];
    }
    return(new_obj);
};

var stdLegend = {
    '&':{'type':'HERO-SQUARE','dx':0,'dy':0,'facing':'down'},
    '#':{'type':'WALL'},
    'M':{'type':'MACHINE'},
    '(':{'type':'HOLE-DISK'},
    '<':{'type':'HOLE-TRIANGLE'},
    '[':{'type':'HOLE-SQUARE'},
    'O':{'type':'DISK'},
    'V':{'type':'TRIANGLE'},
    'H':{'type':'SQUARE'},
    '|':{'type':'PIPE-V'},
    '-':{'type':'PIPE-H'},
    'L':{'type':'PIPE-UR'},
    'J':{'type':'PIPE-UL'},
    '7':{'type':'PIPE-DL'},
    'T':{'type':'PIPE-DR'},
    ';':{'type':'KEY'},
    'I':{'type':'DOOR'}
};

var Levels = [
    /// level 1
    {'map' : [
	"......................",
	".....##############...",
	"....#M....I........#..",
	".####...####..&....#..",
	"#(.O....#..#....###...",
	"#<.V....#..#.;..#.....",
	"#[.H....#...####......",
	".#######.............." 
    ],
     'legend' : {}
    },
    /// level 2
     {
      'map' : [
	  ".....|...######...........",
	  ".....L---b....##########..",
	  ".###.#<.V....;#.<#...(..#.",
	  ".#&#.#H####.###.V#......#.",
	  ".#H#.#......O.(..#...a..#.",
	  "AO.###[###.#######...L----",
	  "#.[....V................#.",
	  "---------7.T--------------",
	  ".........|<|..............",
	  "---7.....|.L--------------",
	  "...|.....|.....#..........",
	  ".#.L-----J.....#.###.###.#",
	  "M#.......#.....#.#M#.#.#.#",
	  "##...T-----B...#.#.#.###.#",
	  ".....|...#.....I..........",
	  ".#...C...#######.#.#.#.#.#"
      ],
	 'legend' : {
	     "A":{'dx':1,'dy':0,'type':'PIPE-H','label':'A','open':true},
	     "a":{'dx':0,'dy':-1,'type':'PIPE-V','label':'A','open':true},
	     "B":{'dx':1,'dy':0,'type':'PIPE-H','label':'B','open':false},
	     "b":{'dx':1,'dy':0,'type':'PIPE-H','label':'B','open':false},
	     "C":{'type':'TURNCOCK-V', 'label':'B'}
	 }
     }
    /// TODO

];

var load_level = function(num) {
    var things = [];
    var the_map = Levels[num].map;
    var the_legend = Levels[num].legend;
    var perim_v = the_map.length;
    var perim_h = the_map[0].length;
    for(var j=0;j<perim_v;j++)
	for(var i=0;i<perim_h;i++) {
	    var t = the_map[j][i];
	    var thing = stdLegend[t];
	    if(thing==undefined) thing = the_legend[t];
	    if(thing==undefined) continue;
	    var new_thing = clone_obj(thing);
	    new_thing.x = i;
	    new_thing.y = j;
	    things.push(new_thing);
	}
    world = mk_world(things,perim_v,perim_h); // muy importante! ;)
    return new_world_order(world);
};