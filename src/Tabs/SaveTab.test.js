import React from "react"
import ReactDOM from "react-dom"
import SaveTab from "./SaveTab"

it("renders without crashing", () => {
  global.chrome = jest.fn()
  const div = document.createElement("div")
  ReactDOM.render(<SaveTab />, div)
  ReactDOM.unmountComponentAtNode(div)
})
