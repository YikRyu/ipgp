import { CustomeDatePipe } from './custome-date.pipe';

describe('CustomeDatePipe', () => {
  it('create an instance', () => {
    const pipe = new CustomeDatePipe();
    expect(pipe).toBeTruthy();
  });
});
