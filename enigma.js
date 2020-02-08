const _ = require('lodash');
const readlineSync = require('readline-sync');

var zipme = (a,b) => {
  return _.zip(_.split(a, ''),_.split(b, ''));
}

var hashme = (a, map) => {
  _.forEach(a, (ia) => {
    if (_.isUndefined(map[ia[0]])) {
      map[ia[0]] = [];
    }
    map[ia[0]].push(ia[1]);
  });
};

a = zipme(
  "DON'T LET YOUR RIGHT HAND KNOW WHAT YOUR LEFT HAND DID",
  "5+,'( \"2( )+-3 r-/:( :*,5 ',+1 1:*( )+3 \"26( :*,5 5-d "
);

b = zipme(
  "ONCE A HACKER IS AN ETERNAL HACKER",
  "+,92 * :*9'23 -4 *, 2(23,*\" :*9'23"
);

c = zipme(
  "A HACKER WITHOUT PHILOSOPHY IS JUST AN EVIL COMPUTER GENIUS",
  "* :*9'23 1-(:+-( @:-\"+4+@:) -4 ;_4( *, 2?-\" 9+.@_(23 /2,-_4"
);

map = {};
hashme(a, map);
hashme(b, map);
hashme(c, map);

var decode = (chr, map) => {
  ret = [];
  _.forOwn(map, (v,k) => {
    //console.log(k, _.join(v, ''));
    if (-1 != _.join(v, '').indexOf(chr)) {
      ret.push(k);
    }
  });

  return ret.join('');
};
var enigma = "+52/*(22020{:*9'234 *32 ,+( !+3, +,\") -( -4 .*52}";
var bases = [];
var portion = decode('9', map);
var start = false;

bases.push([portion]);//C

_.forEach(enigma, (chr) => {
  var portion = decode(chr, map);
  var newBases = [];
  if (portion.length < 1) {
    bases = _.map(bases, (base) => {
      return [base.join('') + '?'];
    });
    return true;
  }

  _.forEach(bases, (base) => {
    _.forEach(portion, (c) => {
      newBases.push([base.join('') + c]);
    });
  });

  bases = _.cloneDeep(newBases);
  newBases = [];

  if (_.isString(bases)) {
    bases = [ bases ];
  }

  if (!start && bases[bases.length-1][0].length > 7) {
    bases = _.filter(bases, (base) => {
      return -1 != base[0].indexOf('CODEGATE');
    });
    start = true;
  }

  if (start && bases.length > 20) {

    var loop = false;
    do {
      _.forEach(bases, (msg) => {
        console.log(msg);
      });
      var filter = readlineSync.question('Filter: ').replace('|', ' ');
      var clean = false;

      if (-1 != filter.indexOf('clean')) {
        filter = filter.replace('clean', '');
        clean = loop = true;
      } else {
        loop = false;
      }

      bases = _.filter(bases, (base) => {
        return (clean) ? -1 == base[0].indexOf(filter) : -1 != base[0].indexOf(filter);
      });
    } while (loop);
  }

});

console.log("results: ");

_.forEach(bases, (msg) => {
  console.log(msg);
});
