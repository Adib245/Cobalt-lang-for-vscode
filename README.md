# Cobalt Lang For VSCode

This is an extension for an upcoming programming language called **Cobalt**(`.cb`,`.cbt`,`.co`,`.cobalt`). Currently, bare bones.

- Showcase-1  

![showcase-1](/assets/showcase-1.png)

- Showcase-2  

![showcase-2](/assets/showcase-2.png)

- Showcase-3  

![showcase-3](/assets/showcase-3.png)

```cobalt
/// # Cobalt lang

import std.io;
import std.core::typeof;
import std.files;
import std.maths;

struct Point
{
   float x, y;

   type(float, float) getPolarCoords() // implicitly has final& this
   {
      float r = sqrt( this.x ** 2 + this.y ** 2 );
      float deg = atan2(this.y, this.x); 
      return (r,deg);
   }
}

void main() throws IOError
{
   const int age = 19;
   println(i"Age = $age");

   int[] arr = [ 1, 2, 3, 4, 5 ];

   auto f = try File("../Concept/random.txt"); // may return error
   string contents = f.read();

   for ( i in 0..10 )
   {
      print(i"i = $i");
      print(`i again = {i}`);
   }

   Point p1 = { x: 12, y: 4 };
   auto p2 = Point{ 12, 4 };
   auto _ = throwawayFn();

   vector<Point> points = {};

   auto s1 = Square(12); // stack
   s1.getArea();

   // heap pointer via '^'(owned pointer)
   Car^ c1 = $("RED");
   
   unsafe {
      Car* c1 = $("RED"); // $() anonymous constructor call
   }
}

// improve existing classes, structs and primitives

type int impl interface 
{
   float toFloat(&this)
   {
      return (this as float);
   }
}

void doSomething(int arg1)
{
   println(i"${arg1.toFloat()}");
}

template<T>
T add(T a, T b) 
{
   return a + b;
}

// template construct can also be defined as 
template
interface Iterable<T> 
{
   T next();
}

// normal (monomorphic) 
class Square
{
 public:
   float sideLength;

   Square(this.sideLength);

   float getArea()
   {
      return sideLength ** 2;
   }
}
// ↑ no vtable or vptr no extending no override


// virtual class (dynamic dispatch) Full OOP
virtual class Car extends Vehicle impl Parkable
{
   // private
   strview m_seatLeather = "Cheap";

 public:
   int numOfWheels = 4;
   strview colour;

   Car(this.colour) // explicit constructor
   {
      println(i"Car colour set to ${this.colour}");
   }

   @override // mandatory override annotation
   void honk()
   {
      println("HONK HONK!");
   }

   final void park()
   {
      println("Parked!");
   }
}

template <T>
class SomeTypeOfList impl Iterable<T> {} 

```
