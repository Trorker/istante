import { describe,expect,it } from 'vitest'
import { classifyFamily,classifyOrientation,classifyShape } from '../src/utils/device'
describe('device classifier',()=>{it('separa phone/tablet/desktop/display',()=>{expect(classifyFamily(390,844)).toBe('phone');expect(classifyFamily(820,1180)).toBe('tablet');expect(classifyFamily(1440,900)).toBe('desktop');expect(classifyFamily(3840,2160)).toBe('display')});it('classifica orientamento e shape',()=>{expect(classifyOrientation(844,390)).toBe('landscape');expect(classifyShape(3440/1440)).toBe('ultrawide')})})
