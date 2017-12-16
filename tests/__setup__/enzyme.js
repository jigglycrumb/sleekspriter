// enzyme setup file
import { configure, shallow, render, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-15";

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;

