enablePlugins(ScalaJSPlugin)

name := "Scala.js Tutorial"
scalaVersion := "2.12.4"

// This is an application with a main method
//scalaJSUseMainModuleInitializer := true

libraryDependencies += "org.scala-js" %%% "scalajs-dom" % "0.9.1"

// libraryDependencies += "be.doeraene" %%% "scalajs-jquery" % "0.9.1"

// skip in packageJSDependencies := false
// jsDependencies +=
//   "org.webjars" % "jquery" % "2.1.4" / "2.1.4/jquery.js"

jsEnv := new org.scalajs.jsenv.jsdomnodejs.JSDOMNodeJSEnv()

// uTest settings
//libraryDependencies += "com.lihaoyi" %%% "utest" % "0.4.4" % "test"
//testFrameworks += new TestFramework("utest.runner.Framework")
