/* 
Khiem Nguyen - CIS 658

Date - 2023/31/03
File's Purpose - Initial testing file generated by npx command 
*/

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
