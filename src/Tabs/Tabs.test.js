import React from "react"
import { create } from "react-test-renderer"
import Tabs from "./Tabs"
import TabsList from "./TabsList"
import { shallow } from "enzyme"

it("renders <Tabs> without crashing", () => {
  const props = {
    getFilteredEntries: jest.fn(() => Promise.resolve({}))
  }
  expect(shallow(<Tabs {...props} />)).toMatchSnapshot()
})

it("renders <TabsList> within <Tabs>", () => {
  const props = {
    getFilteredEntries: jest.fn(() => Promise.resolve({}))
  }
  const component = create(<Tabs {...props} />)
  const rootInstance = component.root

  const childrenComponents = rootInstance.children
  expect(childrenComponents.length).not.toBe(0) //TODO: expect different behaviour
})

it("renders <TabsList> without crashing", () => {
  const props = {
    entry: {
      fields: {
        url: "http://abc.com",
        name: "tab title",
        tag: {
          fields: {
            name: "test"
          }
        }
      },
      sys: {
        id: 1
      }
    }
  }
  const TabsListComponent = create(<TabsList {...props} />)
  expect(TabsListComponent.toJSON()).toMatchSnapshot()
  expect(
    TabsListComponent.root.findAllByProps({ className: "item", id: 1 }).length
  ).toBe(1)
})

it("removes a tab when the appropriate button is clicked", () => {
  const props = {
    entry: {
      fields: {
        url: "http://abc.com",
        name: "tab title",
        tag: {
          fields: {
            name: "test"
          }
        }
      },
      sys: {
        id: 1
      }
    }
  }
  const component = create(<TabsList {...props} />)
  const rootInstance = component.root
  const button = rootInstance.findAllByType("button")
  const DOMEvent = {
    preventDefault: jest.fn(),
    currentTarget: {
      dataset: {
        entryId: 1
      }
    }
  }
  // console.log(rootInstance.findAllByProps({ className: "item" })[0].props)
  // console.log(rootInstance.findAllByProps({ className: "item" })[1].props)
  expect(button[1].props.className.includes("red")).toBe(true)
  button[1].props.onClick(DOMEvent)
  console.log(button[1].props)
  // console.log(rootInstance.findAllByProps({ className: "item", id: 1 }).length)
  // expect(component.children).toBe(1)
})
