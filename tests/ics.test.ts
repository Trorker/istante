import { describe,expect,it } from 'vitest'
import { parseIcs } from '../src/services/calendar/ics'
describe('ICS parser',()=>{it('legge un VEVENT base e prefissa UID col calendario',()=>{const x=parseIcs('BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:a\nDTSTART:20260912T103000Z\nSUMMARY:Test\nEND:VEVENT\nEND:VCALENDAR','cal-1');expect(x).toHaveLength(1);expect(x[0].id).toBe('cal-1:a');expect(x[0].title).toBe('Test')})})
