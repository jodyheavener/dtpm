import { insert, Rectangle } from 'dtpm/document';
import { done } from 'dtpm/plugin';

export async function helloWorld() {
  const rectangle = new Rectangle({
    name: 'Example',
    width: 50,
    height: 50
  });

  insert(rectangle);
  done();
}
