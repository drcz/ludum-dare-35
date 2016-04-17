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
    '&':{'type':'HERO-SQUARE','dx':0,'dy':0,'facing':'left','inventory':[]},
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
    /// level 1 -- nauka o regułach
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
     'legend' : {},
     'name' : 'welcome to the torus'
    },
    /// level2: nauka o wpadaniu w dziury.
    /// TODO
    /// level 3 -- nauka o działkach
    {'map' : [
	"........###..(..#.|..###",
	".......##A#######.L--#.#",
	"......#..............###",
	"...####.................",
	"###(.O....#......#######",
	"...<......#..&..#....V..",
	"--7.....#.#.....#.T-----",
	"..|.....###..O..#.|.....",
	"..L------7#.....#.|....." 
    ],
     'legend' : {'A': {'type':'GUN','dx':0,'dy':1,'facing':'down','count':0,'maxcount':4}},
     'name' : 'meeting guns'
    },
    /// level 4 -- nauka o blokowaniu działek figurami
    /// level 5 -- nauka o ruroportacji
    /// level 6 -- nauka o ruroportacji figur
    /// level 7 -- nauka 
    /// level 8 first dark ride!
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
	 },
	 'name' : 'first dark ride'
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
    world = mk_world(things,perim_v,perim_h); // muy importante!
    return new_world_order(world);
};

/// check how many of these little shits are on the level y'know...
/// YAEEEY, SHAPES AND NUMBERS! :D
var count_shapes = function(world) {
    var shapes={'squares':0,'triangles':0,'disks':0};
    for(var i=0;i<world.things.length;i++) {
	switch(world.things[i].type) {
	case 'SQUARE': shapes.squares++; break;
	case 'TRIANGLE': shapes.triangles++; break;
	case 'DISK': shapes.disks++; break;
	}
    }
    return shapes;
};