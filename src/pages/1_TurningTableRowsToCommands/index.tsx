import { Code, CodeOutput, CodeOutputViewer, Output } from '../../components/CodeOutput';
import { Page } from '../../components/Page';

export function TurningTableRowsToCommands() {
  return (
    <Page>
      <h1>Turning Table Rows To Commands</h1>
      <p>This is a placeholder for the blog post.</p>
      <App/>
    </Page>
  );
}


function App() {
  return (
    <CodeOutputViewer>
      <CodeOutput title="Hello World">
        <Code>
          {`function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);`}
        </Code>
        <Output>{`Hello, World!`}</Output>
      </CodeOutput>

      <CodeOutput title="Array Methods">
        <Code>
          {`const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
const sum = doubled.reduce((a, b) => a + b, 0);

console.log("Doubled:", doubled);
console.log("Sum:", sum);`}
        </Code>
        <Output>{`Doubled: [2, 4, 6, 8, 10]
Sum: 30`}</Output>
      </CodeOutput>

      <CodeOutput title="Object Destructuring">
        <Code>
          {`const person = {
  name: "Alice",
  age: 30,
  city: "New York"
};

const { name, age, ...rest } = person;

console.log(\`\${name} is \${age} years old\`);
console.log("Rest:", rest);`}
        </Code>
        <Output>{`Alice is 30 years old
Rest: { city: "New York" }`}</Output>
      </CodeOutput>
    </CodeOutputViewer>
  )
}
