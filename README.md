# Cobalt Lang For VSCode

This is an extension for an upcoming programming language called **Cobalt**(`.cb`,`.cbt`,`.co`,`.cobalt`). Currently, in the works. Wait a decade or two.

- Showcase-1  

![showcase-1](assets/showcase-1.png)

- Showcase-2  

![showcase-2](assets/showcase-2.png)

- Showcase-3  

![showcase-3](assets/showcase-3.png)

- Showcase-4  

![Showcase-4](assets/showcase-4.png)

- Showcase-5  

![showcase-5](assets/showcase-5.png)

- Showcase-6  

![showcase-6](assets/showcase-6.png)

- Showcase-7

![showcase-7](assets/showcase-7.png)

- Showcase-8

![showcase-8](assets/showcase-8.png)

- Showcase-9

![showcase-9](assets/showcase-9.png)

- Showcase-10

![showcase-10](assets/showcase-10.png)

```cobalt
/// # Cobalt lang

import std.io;
import std.files;
import std.maths;

// just like zig all access is handled via '.'

// this lang uses a lot of "annotation"(s) built-in and custom(not planned yet)
import @fromFile("./mylib/my_types.cb") as MyTypes;

type Squares = ArrayList<Square>;

// no encapsulation, no explicit constructor
struct Point 
{
   float x;
   float y;

   type(float, float) getPolarCoords() // implicitly has 'final& this'
   {
      float r = sqrt( this.x ** 2 + this.y ** 2 );
      float deg = atan2(this.y, this.x); 
      return ( r, deg );
   }
}

// almost rust enums; doesn't support methods
enum WebEvent 
{
   // 1. Unit variant: Contains no data at all; just an id
   PageLoad,                 
   // 2. Tuple variant: Contains unnamed, ordered data
   KeyPress( char ),           
   Paste( String ),            
   // 3. Struct variant: Contains named fields
   Click { x: i64, y: i64 }, 
}

// does supports struct/static class like methods; 
// syntax inspired from dart
enum class WebEvent 
{
   // 1. Unit variant: Contains no data at all; just an id
   PageLoad,                 
   // 2. Tuple variant: Contains unnamed, ordered data
   KeyPress( char ),           
   Paste( String ),            
   // 3. Struct variant: Contains named fields
   Click { x: i64, y: i64 }
   ;

   String summary() {
      match (&this) {
         WebEvent.PageLoad => String("Load");
         WebEvent.KeyPress( _ ) => String("Type");
         WebEvent.Paste( _ ) => String("Paste");
         WebEvent.Click { .. } => S"Click"; // S"" is the literal for 'String'
      }
   }
}

// funcs are camel cae; 
// {} for labelled params similar to dart but requirement semantics is like rust via 'Optional<T>'
// initialize labelled params to some default data for optionalising
fn webEventHandler({ WebEvent event }): void // fn is like auto so ": void" is not needed
{
   final load = WebEvent.PageLoad; // we use '.' like zig
   final key  = WebEvent.KeyPress( 'a' );
   final click = WebEvent.Click { x: 320, y: 240 }; // 'x:' is unnecessary

   // enums are exhaustively matched
   match ( event ) 
   {
      WebEvent.PageLoad => println("Page loaded!"); // you use ';'
      WebEvent.KeyPress( c ) => println(i"Pressed key: {c}");
      WebEvent.Paste( text ) => println(i"Pasted text: {text}");
      WebEvent.Click { x, y } => {
         println(i"Clicked at x: {x}, y: {y}");
      };
      default => errPrintln("Error"); // we should never reach this
   }

   // also this is doable; looks similar to java enhanced switches
   // match () 
   // {
   //    case expr => stmt;
   //    default => stmt;
   // }
   //  bcs certain stmts are to small o notice and one could possible mistake a branch
}

error MyErrors 
{
   SleepError("Could not go to sleep"), // zig like error enums but with default val support
}

//! Async lib features not finalised
Future<String> fetchData() async 
{
  await Future.delayed( Duration( seconds: 2 )); 
  return 'Data loaded';
}


void main() throws IOError
{
   int x; // un-initialised means varstate = invalid in compiler

   auto age1 = 19;
   final int age2 = 20;
   const int age3 = 21;

   println(i"Ages = $age, $age2, $age3");

   // core collection types
   // Array
   int[] arr = [ 1, 2, 3, 4, 5 ];
   
   //Array Matrix; size must be specified; 
   int[ 5 ][ 3 ] matrix = [ 
      [ 1, 2, 3, 4, 5 ],
      [ 1, 2, 3, 4, 0 ],
      [ 1, 2, 0, 4, 5 ],
   ];


   // Tuple
   auto( int:2, float:2, strview, int) tuple = ( 1, 0xb6ad, 3.14159 , 4.0, "gg", 0b10 );
   
   auto tuple2 = ( true, 0o44, S"hello" );

   // Tuple matrix ; allows for any type
   auto matrix2 = (
      ( 1, 2.44, 3, 4, 5 ),
      ( 1, "hh", 3, 4, 0 ),
      ( 1, true, 0, 4, 5 )
   );

   auto fileObj = try File( "../Concept/random.txt" ); // may return error
   String contents = fileObj.read();

   for (final i in 0..10 ) // inclusive range; num..<otherNum is exclusive
   {
      print(i"i = $i");
      print(`i again = {i:0xff7a7a}`); // coloured output ; red
   }

   Point p1 = { x: 12, y: 4 };
   auto p2 = Point{ 12, 4 };
   
   // placeholder var
   auto _ = throwawayFn();

   ArrayList<Point> points = { Point{ 12, 4 }, Point{ 11, 4 }, Point{ 12, 3 } }; // vector

   for ( p in points) 
   {
      p.x += 1;
      println(i"A Point = (${p.x}, ${p.y})");
   }

   const square1 = Square( 12 ); // stack ; is done at compile-time
   square1.getArea();
   const s1 = const Square(6); // same thing (const decl + explicit const call)

   final s1 = virtual Square(1); // Force a runtime call
   

   // heap pointer via '^'(owned pointer)
   Car^ car1 = $( "RED" ); // $() is a syntax pattern that means anonymous constructor 
   TypeAny carData = car1.^; // deref

   
   unsafe { // <- btw only this is formatted this way
      Car* car = $( "RED" ); 
      TypeAny something = car.*; // deref
   }

   auto someEvent = WebEvent.PageLoad;
   // fnCall with param label
   webEventHandler( event: someEvent );

   // while (true) {} // error: condition must not be always true/false
   
   int counter;
   while (counter < 100) [counter++] 
   {
      /* do something */
   } 

   loop 
   {
      // explicit infinite loop
      // exit via break 
   }
}

template<T>
T add( T a, T b ) 
{
   return a + b;
}

// 'template construct' can also be defined as 
template
interface Iterable<T> 
{
   fn next(): T;
}


// improve existing classes, structs and primitives
impl type int   
{
   float toFloat( &this )
   {
      return ( this as float );
   }
}

// and
impl Iterable for type int {}

impl Iterable for MyTypes.SomeClass {}


void doSomething( int arg1 )
{
   println(i"${arg1.toFloat()}");
}

class CustomInt impl ( Iterable, Comparable ) {
   
   int val = 0;

 public:
   /*

   CUSTOM LOGIC

   */

   get bool isOdd()
   {
      return ( this & 1 ) != 0;
   }
   
   get bool isEven()
   {
      return ( this & 1 ) == 0;
   }
   
   set setVal(int input)
   {
      val = input;
   }

   // static method
   static CustomInt tryParse( String source, { int radix } )
   {
      /* TODO */
   }
}

// normal (monomorphic)  
class Square
{
 public:
   static const int numberOfSide = 4; // static has highest priority; so in front

   float sideLength;

   const Square( this.sideLength );  // meaning can be called at compile time

   float getArea()
   {
      return sideLength ** 2;
   }
}
// ↑ no vtable or vptr so, no extending no override; can implement interfaces


// virtual class (dynamic dispatch); OOP; somewhat like C#
virtual class Car extends Vehicle impl Parkable
{
   // implicitly private
   strview m_seatLeather = "Cheap";

 public:
   int numOfWheels = 4;
   strview colour;
   strview brand;
   
   Car( this.colour ) // explicit constructor
   {
      println(i"Car colour set to ${this.colour}");
   }

   @override // mandatory override annotation
   void honk()
   {
      println("HONK HONK!");
   }

   // non-overridable
   final void park()
   {
      println("Parked!");
   }

}

class User 
{
   final String name; 
   final int age;

 public:

   User({ this.name, this.age });

   // Factory constructor for JSON deserialization
   factory User.fromJson( Map<String, TypeAny> json ) {
      return User (
         name: json[ "name" ] as String,
         age: json[ "age" ] as int,
      );
   }
}


template <T>
class SomeTypeOfList impl Iterable<T> {}

// or (yes the template keyword should formatted above not inline)
// template 
// class SomeTypeOfList<T> impl Iterable<T> {} 

```
