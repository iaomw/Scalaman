package main.scala

import scala.scalajs.js

import js.annotation._
import js.JSConverters._

import js.Dynamic.{ global => g }

@ScalaJSDefined
trait PathFindingOptions extends js.Object {
  val mapTile: js.Array[String]
  val origin: LocationOptions
  val destin: LocationOptions
}

@ScalaJSDefined
trait LocationOptions extends js.Object {
  val x: Int
  val y: Int
}

@ScalaJSDefined
trait CollisionOptions extends js.Object {

  val mapTile: js.Array[String]
  val location: LocationOptions
}


@JSExport
class Location(val x: Int, val y: Int) {
  def toJSObject(): LocationOptions = {
    val xv = x;
    val yv = y;
    new LocationOptions {
      val x: Int = xv
      val y: Int = yv
    }
  }
}

@JSExport("MainObject")
object MainObject {

  @JSExport
  def main(): Unit = {
    println("Hello world!")
  }

  @JSExport
  def testCollision(options: CollisionOptions): Boolean = {

    val mapTile = options.mapTile.toArray
    val location = options.location

    val index = location.y * 28 + location.x
    val sample = mapTile(index)

    return (sample != "|" && sample != "#")
  }

  @JSExport
  def pathfinding(options: PathFindingOptions): js.Array[LocationOptions] = {

    val mapTile = options.mapTile.toArray
    val origin = options.origin
    val destin = options.destin

    val originL = new Location(origin.x, origin.y)
    val destinL = new Location(destin.x, destin.y)

    val path = pathfinding(mapTile, originL, destinL, new Array[Location](0)).map(sample => sample.toJSObject())

    return path.toJSArray
  }

  def pathfinding(mapTile: Array[String], origin:Location, destin:Location, initiation: Array[Location]): Array[Location] = {

    // deepest
    if (initiation.length == 8) { return initiation }

    val score = scoreCal(mapTile, origin, destin)

    val visited = initiation :+ origin
    if (score == 0) {return visited }

      val up = new Location(origin.x, origin.y-1)
      val down = new Location(origin.x, origin.y+1)
      val left = new Location(origin.x-1, origin.y)
      val right = new Location(origin.x+1, origin.y)

      val testPosition = Array(up, down, left, right)

      val nextPosition = testPosition.tail.foldLeft(testPosition.head) { (aPos, bPos) =>
        val aScore = scoreCal(mapTile, aPos, destin)
        val bScore = scoreCal(mapTile, bPos, destin)

        if (aScore <= bScore) {
          aPos
        } else {
          bPos
        } // check
      }

      val index = nextPosition.y * 28 + nextPosition.x
      val sample = mapTile(index)

      if (sample != "|" && sample != "!") {
        val thisIndex = origin.y * 28 + origin.x;
        mapTile(thisIndex) = "!" // Changing?
        return pathfinding(mapTile, nextPosition, destin, visited)
      } else {
        return visited
      }
  }

  def scoreCal(mapTile: Array[String], origin: Location, destin: Location): Int = {

    val index = origin.y * 28 + origin.x
    val sample = mapTile(index)

        sample match {
          case "|" | "!" | "#" => Int.MaxValue
          case _ => {
            
            val deltaX = destin.x - origin.x
            val deltaY = destin.y - origin.y

            return Math.abs(deltaX) + Math.abs(deltaY)
          }
        }
  }
}

