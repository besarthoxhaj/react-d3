import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.wait = (time = 0) => new Promise(ok => {
  setTimeout(() => {
    ok();
  }, time);
});

global.fetchOk = (resJson) => () => new Promise(ok => ok({
  status: 200,
  json: () => new Promise(json => json(resJson)),
}));
