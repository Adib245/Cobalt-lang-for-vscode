# Cobalt Lang For VSCode

This is an extension for an upcoming programming language called **Cobalt**(`.cb`,`.cbt`,`.co`,`.cobalt`). Currently, in the works. Wait a decade or two. [Compiler version = `indev`]

- Showcase-1  

![showcase-1](./assets/showcase-1.png)

- Showcase-2  

![showcase-2](./assets/showcase-2.png)

- Showcase-3  

![showcase-3](./assets/showcase-3.png)

- Showcase-4  

![Showcase-4](./assets/showcase-4.png)

- Showcase-5  

![showcase-5](./assets/showcase-5.png)

- Showcase-6  

![showcase-6](./assets/showcase-6.png)

- Showcase-7

![showcase-7](./assets/showcase-7.png)

- Showcase-8

![showcase-8](./assets/showcase-8.png)

- Showcase-9

![showcase-9](./assets/showcase-9.png)

- Showcase-10

![showcase-10](./assets/showcase-10.png)

- Showcase-11

![showcase-11](./assets/showcase-11.png)

- Showcase-12

![showcase-12](./assets/showcase-12.png)

- Showcase-13

![showcase-13](./assets/showcase-13.png)

- Showcase-14

![showcase-14](./assets/showcase-14.png)

- Showcase-15

![showcase-15](./assets/showcase-15.png)

- Showcase-16

![showcase-16](./assets/showcase-16.png)

- Showcase-17

![showcase-17](./assets/showcase-17.png)

- Showcase-18

![showcase-18](./assets/showcase-18.png)

```cobalt

///% SPDX-License-Identifier: Apache-2.0
///% file: $PROJECT_DIR\src\main.cbt 
///% langrev: 0.0.01-alpha

//↑ these are metadata comments; must be at the top of the file else error
// both / and \ are supported in all types of comments

/// # Cobalt lang

import std.io;
import std.files;
import std.maths;
import std.containers.arraylist;
// just like zig all access is handled via '.'

import "./mylib/my_types.cb" as MyTypes;

import legacy "stdio.h" as stdio;

type Squares = ArrayList<Square>;

@distinct // makes the following type non-synonymous
type Minutes = int;

// no encapsulation, no explicit constructor
struct Point 
{
   float x, y;

   var(float, float) getPolarCoords() // implicitly has '&this'
   {
      float r = sqrt( this.x ** 2 + this.y ** 2 );
      float deg = atan2(this.y, this.x); 
      return ( r, deg );
   }

   // var& is mutable ref
   fn increment(var& this, int addToX, int addToY) : void
   {
      this.x += addToX;
      this.y += addToY;
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
   Click {
      long x;
      long y;
   }
}

// does supports struct/static class like methods; 
// syntax inspired from dart
enum class WebEvent2 
{
   // 1. Unit variant
   PageLoad,
   // 2. Tuple variant
   KeyPress( char ),
   Paste( String ),

   // 3. Struct variant
   Click {
      long x;
      long y;
   }
   ;

   String summary() {
      match () { // implicitly has '&this' ; immutable ref
         WebEvent.PageLoad => String("Load");
         WebEvent.KeyPress( _ ) => 'K';
         WebEvent.Paste( _ ) => String("Paste");
         WebEvent.Click { _ } => s"Click"; // S"" is the literal for  String
      }
   }
}

fn retSomething() // fn is like auto so annotating this as "String" is not needed
{
   return "ff";
}

// initialize labelled params to some default data for optionalising
fn webEventHandler({ WebEvent event }): void // for void type, type annotation is needed
{
   final load = WebEvent.PageLoad; 
   final key  = WebEvent.KeyPress( 'a' );
   final click = WebEvent.Click { x: 320, y: 240 }; // 'x:' is unnecessary

   // enums are exhaustively matched
   match ( event ) 
   {
      // bcs we're comparing against a var of type 'WebEvent', we can just do implicit access (".member")
      .PageLoad => println("Page loaded!"); // you use ';' here; bcs match 'stmt'
      .KeyPress( c ) => println(i"Pressed key: $c");
      .Paste( text ) => println(i"Pasted text: {text:>10}");
      .Click { x, y } => {
         println(i"Clicked at x: {x}, y: {y}");
      };
      // default => errPrintln("Error"); // we should never reach this
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
   int x; // un-initialised means unusable unless initialised/assigned

   var age1 = 19;
   final int age2 = 20;
   const int age3 = 21;

   println(i"Ages = $age1, $age2, $age3");
   writeln("Ages = ", age1, age2, age3);

   stdio.printf(
      "variables = %d %d %d\n",
      age1, age2, age3
   );

   // core collection types
   // Array
   int[5] arr = [ 1, 2, 3, 4, 5 ];

   for ( a in arr) 
   {
      print(a);
   }

   for ( idx, val of arr) 
   {
      print(i"arr[$idx] = $val");
   }

   // Array Matrix; size must be specified; 
   int[3, 5] matrix = [ 
      [ 1, 2, 3, 4, 5 ],
      [ 1, 2, 3, 4, 0 ],
      [ 1, 2, 0, 4, 5 ],
   ];
   
   int[3, 2, 2] matrix = [ 
      [
         [1, 2] , [3, 4]
      ],
      [
         [5, 6] , [7, 8]
      ],
      [
         [9, 1] , [2, 3]
      ],
   ];


   // Tuple
   var( int:2, float:2, strview, int) tuple = ( 1, 0xb6ad, 3.14159 , 4.0, "gg", 0b10 );
   
   var tuple2 = ( true, 0o44, S"hello" );

   // Tuple matrix ; allows for any type
   var matrix2 = (
      ( 1, 2.44, 3, 4, 5 ),
      ( 1, "hh", 3, 4, 0 ),
      ( 1, true, 0, 4, 5 )   
   );

   // Map
   var map1 = {
      1 : "America",
      2 : "Canada",
      3 : "Australia",
      4 : "Russia",
   }
   
   var{int, strview} map2 = {
      1 : "America",
      2 : "Canada",
      3 : "Australia",
      4 : "Russia",
   }

   var fileObj = try File( "../Concept/random.txt" ); // may return error
   String contents = fileObj.read();
   defer fileObj.close();

   for (final i in 0..10 ) // inclusive range; num..<otherNum is exclusive
   {
      print(i"i = $i");
      print(`i again = {i:0xff7a7a}`); // coloured output ; red
   }

   Point p1 = { x: 12, y: 4 };
   var p2 = Point{ 12, 4 };
   
   // placeholder var
   var _ = throwawayFn();

   ArrayList<Point> points = { Point{ 12, 4 }, Point{ 11, 4 }, Point{ 12, 3 } }; // vector

   for ( p in points) 
   {
      p.x += 1;
      println(i"A Point = (${p.x}, ${p.y})");
   }
   
   const square1 = Square( 12 ); // stack ; is done at compile-time (const)
   square1.getArea();
   const s1 = const Square(6); // same thing (const decl + explicit const call)

   final s1 = virtual Square(1); // Force a runtime call
   
   // Safe heap pointer via '^'(owned pointer)
   Car^ car1 =  { "RED" };  // '{}' in expr form is the universal initialiser
   TypeAny carData = car1.^; // deref

   unsafe { 
      Car* car = { "RED" }; 
      TypeAny something = car.*; // deref
   }

   var someEvent = WebEvent.PageLoad;
   // fnCall with param label
   webEventHandler( event: someEvent );

   // while (true) {} // error: condition must not be always true/false
   
   int counter;
   while (counter < 100)
   {
      /* do something */

      counter += 1;
   } 

   loop 
   {
      // explicit infinite loop
      // exit via break 
   }

   // Lambdas / anonymous functions 
   var lambda1 = () {
      print("Hello");
   };
   lambda1();

   var lambda2 = () => print("Hello");
   lambda2();

   var lambda3 = void() {
      print("Hello");
   };
   lambda3(); 

   var lambda4 = fn():void {
      print("Hello");
   };
   lambda4(); 

   // explicitly typed
   fn():void lambda5 = () {
      print("Hello");
   };
   lambda5();
   
   fn(int):Duration lambda6 = (age) {
      return Duration(years: age);
   };
   lambda6();

   var lambda7 = (int age) {
      return Duration(years: age);
   };
   lambda6();

   var some = do {
      final a = 4;
      final b = 9;

      eval a + b;
   };

   // records ; their types are dynamically generated structs at compile time
   var record1 = {
      name: "Guy",
      age: 20
   };

   crap(arg2: 4); // arg1 is pre-initialised in param list,

   // move, copy
   
   int a = 10;
   int b = a; // Copy assignment
   // Both a and b are fully valid and independent.
   print(a); // 10
   print(b); // 10

   fn example(int a) : void
   {
      print(a);
   }

   int var1 = 1;
   example(var1); // auto copy bcs primitive types are lightweight
   example(move var1); // override default behaviour.
   example(copy var1); // redundant 


   fn example(ExampleType a) : void
   {
      print(a);
   }
   // doeasn't implement `Copyable` interface so default behaviour is move
   ExampleType var2 = {}
   example(var2); // move
   example(move var2); // redundant
   example(copy var2); // override default behaviour. 

   ExampleType var3 = {};
   ExampleType var4 = var1; // Move assignment (default)
   // var4 is now invalidated / consumed! 
   // Trying to use var3 here triggers a compile-time error.

   // Forcing a clone/copy on a move-by-default type
   ExampleType var3 = {};
   ExampleType var4 = copy var3; // Explicit copy; var3 remains valid!
   // Forcing a move (though redundant for move-by-default types, good for clarity or templates)
   ExampleType var5 = move var3; // Explicit move; var3 becomes invalid.
}


fn crap({int arg1 = 0, int arg2})
{
   return arg1 + arg2;
}

template<T>
where [ T : Numeric ] 
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

// Extensiation; improve existing classes, structs and primitives
impl type int   
{
   float toFloat()
   {
      return ( this as float );
   }
}

// and
impl Iterable for type int {}
impl Iterable for MyTypes.SomeClass {}


void doSomething( int arg1 )
{
   println(i"something = ${arg1.toFloat()}");
}

class CustomInt impl ( Iterable, Comparable ) 
{   
   int val = 0;

 public:

   CustomInt(this.val);

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
   static int numberOfSide = 4;

   float sideLength;

   const Square( this.sideLength );  // meaning can be called at compile time

   float getArea()
   {
      return (this.sideLength ** 2); // Exponentiation
   }
}
// ↑ no vtable or vptr so, no extending no override; can implement interfaces


// virtual class (dynamic dispatch); OOP; somewhat like C#
virtual class Car extends Vehicle impl Parkable
{
   // implicitly private
   strview m_seatLeather = "Cheap";

 public:
   static int numOfWheels = 4;
   strview colour;
   strview brand;
   
   this( this.colour ) // constructor
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

class Person
{
   // getters and setters
   int age = { 
      get,
      set(arg) [arg > 0]
   };

 public:
   this();
}

class User 
{
   final int idHash;
 public:

   final String name; 
   final int age;

   User({ this.name, this.age });  // constructor

   // Factory constructor for JSON deserialization
   factory User.fromJson( Map<String, TypeAny>& json ) 
   {
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

// cannot be extended
final virtual class Name1 extends Other
{
 public:
   Name1();
}

// can't be instantiated
class Name2 
{
 private:
   Name2(); 
}

// can't be instantiated
virtual class Name2 
{
 protected:
   Name2(); // can be used by derived classes 
}

// doesn't support 'Extensiation' ; also doable with structs
sealed class Name3
{
 public:
   Name3();
}

// can span multiple files ; doesn't affect functionality
partial class Name4
{
 public:
   Name4();
}

// Can't be Instantiated ; all members are automatically/forced to be static
static class Name5
{
 public:
   // Name5(); // must not have constructor
}




```
