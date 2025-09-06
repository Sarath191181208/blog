import { Code, CodeOutput, CodeOutputViewer, Output } from '../../components/CodeOutput';
import { Page, PageTitle } from '../../components/Page';
import { Tldr } from '../../components/Tldr';
import { Intro } from '../../components/Intro';
import { PageSection } from '../../components/PageSection';

export function TurningTableRowsToCommands() {
  return (
    <Page>
      <PageTitle>
        Turning Rows into actionalbe elements in console
      </PageTitle>
      <PageTLDRSection />
      <PageIntroSection />
      <PageExtractingOneColumnSection />
      <PageExtractingMultipleColumnsSection />
      <PageFeedingIntoCommandSection />
      <PageXargsNSection />
      <PageTwoColumnsIntoFlagsSection />
      <PageKubectlDeleteSection />
      <PageShTrickExplainedSection />
      <PageWrapUpSection />
    </Page>
  );
}

function PageTLDRSection() {
  return <Tldr>
    <p>
      When you see a table in the terminal, you don't have to copy-paste by hand.
      You can <code>awk</code> to pick out columns, <code>xargs</code> to turn them into arguments, and <code>sh -c</code> when you need reordering.
    </p>
    <Code language='bash'>
      {`
kubectl get pods
  | awk 'NR>1 {print $1, $2}' 
  | xargs -n2 sh -c 'kubectl delete pod "$1" -n "$2"' sh`}
    </Code>

    <p>
      Well that's the final trick, don't worry if you don't understand it yet, we will build up to it step by step.
    </p>

  </Tldr>
}

function PageIntroSection() {
  return <Intro>
    <h2> Introduction </h2>
    <p>If you live in the terminal, you've probably run into this:</p>
    <ul>
      <li>A command prints a nice table of values</li>
      <li>You need to copy just one or two columns</li>
      <li>Then paste them into another command</li>
    </ul>
    <p>It's tedious to do by hand, but the shell has tools to automate this beautifully.</p>
    <p>In this post, we'll start simple (one column) and build up to more complex scenarios (multiple args, reordering, flags, and the infamous <code>sh -c trick</code>).</p>
  </Intro>
}

function PageExtractingOneColumnSection() {
  return <PageSection>
    <h2> Extracting one column </h2>
    <p>
      Suppose we have a toy table of people:
    </p>
    <CodeOutputViewer>
      <CodeOutput title={'Print the table'}>
        <Code language='bash'>
          {`
echo -e '\n    ID Name  Age
    1  Alice 23 
    2  Bob   30 
    3  Carol 27' `}
        </Code>
        <Output>{`
ID Name  Age
1  Alice 23 
2  Bob   30 
3  Carol 27 
      `}</Output>
      </CodeOutput>
      <CodeOutput title={'Extract a age row from the table'}>
        <Code language='bash'>
          {`
echo -e \
   'ID Name  Age
    1  Alice 23 
    2  Bob   30 
    3  Carol 27' | 
awk 'NR>1 {print $3}' `}
        </Code>
        <Output>{`
23
30
27
      `}</Output>
      </CodeOutput>
    </CodeOutputViewer>
    <p>
      Explination: <code>{`awk 'NR>1 {print $2}'`}</code>
      <ul>
        <li> skip the header -{'>'} <code>{`(NR>1)`}</code></li>
        <li>  print the second column -{'>'} <code> {`{print $2}`} </code> </li>
      </ul>
      <p>
        Think of <code>awk</code> as a laser cutter: it slices out exactly the columns you want.
      </p>
    </p>
  </PageSection>
}

function PageExtractingMultipleColumnsSection() {
  return (
    <PageSection>
      <h2>Step 2: Extracting Multiple Columns</h2>
      <p>We can slice out more than one column at once.</p>
      <CodeOutputViewer>
        <CodeOutput title="Extracting Multiple Columns">
          <Code language="bash">
            {`
echo -e \\
    'ID Name  Age City 
     1  Alice 23  Paris 
     2  Bob   30  Berlin 
     3 Carol 27 Tokyo' | 
awk 'NR>1 {print $2, $4}' `}
          </Code>
          <Output>
            {`
Alice   Paris
Bob     Berlin
Carol   Tokyo`}
          </Output>
        </CodeOutput>
      </CodeOutputViewer>
      <p>
        Here, <code>$2</code> is Name, <code>$4</code> is City. Easy!
      </p>
    </PageSection>
  );
}

function PageFeedingIntoCommandSection() {
  return (
    <PageSection>
      <h2>Step 3: Feeding into a Command</h2>
      <p>Let's say you want to greet each person, by name. We can pipe the names into <code>xargs</code></p>
      <CodeOutputViewer>
        <CodeOutput title="Feeding into a Command">
          <Code language="bash">
            {`
echo -e \\
    'ID Name  Age City 
     1  Alice 23  Paris 
     2  Bob   30  Berlin 
     3 Carol 27 Tokyo' |
awk 'NR>1 {print $2}' |
xargs echo 'Hello'
`}
          </Code>
          <Output>
            {`Hello Alice Bob Carol`}
          </Output>
        </CodeOutput>
        <CodeOutput title='How this command is transformed: '>
          <Code language='bash'>
            {`
echo 'Hello' 'Alice' 'Bob' 'Carol'
`}
          </Code>
          <Output>
            {`Hello Alice Bob Carol`}
          </Output>
        </CodeOutput>
      </CodeOutputViewer>
      <p>
        <code>xargs</code> collects items and appends them into the command. Here it converted into the following:
        <br />
        <code>echo 'Hello' 'Alice' 'Bob' 'Carol'</code>
      </p>
      <p>
        That's neat but not quite what we want. We want to greet each person individually, like this:
        <br />
        <pre>
          <code>
            echo 'Hello' 'Alice'<br />
            echo 'Hello' 'Bob'<br />
            echo 'Hello' 'Carol'<br />
          </code>
        </pre>
        Here comes the magic of <code>-n</code> flag in <code>xargs</code>, which we will cover in the next section.
      </p>
    </PageSection>
  );
}

function PageXargsNSection() {
  return (
    <PageSection>
      <h2>Step 4: Running a command for each line</h2>
      <p>
        The <code>-n</code> flag in <code>xargs</code> is used to specify the maximum number of arguments to be used for each command execution.
      </p>
      <CodeOutputViewer>
        <CodeOutput title="Run command for each arg">
          <Code language="bash">
            {`
echo 'Alice Bob Carol' | 
  xargs -n1 echo "Hello"

# The above code converted to something similar below: 
#   echo 'Hello' 'Alice'
#   echo 'Hello' 'Bob'
#   echo 'Hello' 'Carol'
`}

          </Code>
          <Output>
            {`Hello Alice
Hello Bob
Hello Carol`}
          </Output>
        </CodeOutput>
        <CodeOutput title="Understanding n batching">
          <Code language="bash">
            {`
echo 'Alice Bob Carol' | 
  xargs -n2 echo 'Hello'

# The above code converted to something similar below: 
#   echo 'Hello' 'Alice' 'Bob'
#   echo 'Hello' 'Carol'
`}
          </Code>
          <Output>
            {`Hello Alice Bob
Hello Carol`}
          </Output>
        </CodeOutput>
      </CodeOutputViewer>
      <p>
        So <code>-n1</code> = one row at a time, <code>-n2</code> = two per batch, etc.
      </p>
    </PageSection>
  );
}

function PageTwoColumnsIntoFlagsSection() {
  return (
    <PageSection>
      <h2>Step 5: Two Columns into Flags</h2>
      <p>Here's a more realistic table (simulating docker ps):</p>
      <CodeOutputViewer>
        <CodeOutput title="Simulating docker ps">
          <Code language="bash">
            {`
echo -e \\
  'CONTAINER_ID   IMAGE       STATUS 
   123abc         nginx       Up 
   456def         redis       Up 
   789ghi         postgres    Exited'`}
          </Code>
          <Output>
            {`
CONTAINER_ID   IMAGE       STATUS 
123abc                 nginx          Up 
456def                 redis           Up 
789ghi                 postgres     Exited
`}
          </Output>
        </CodeOutput>
        <CodeOutput title="Extracting container ID and image name">
          <Code language="bash">
            {`
echo -e \\
  'CONTAINER_ID   IMAGE       STATUS 
   123abc         nginx       Up 
   456def         redis       Up 
   789ghi         postgres    Exited' | 
awk 'NR>1 {print $1, $2}' `}
          </Code>
          <Output>
            {`
123abc nginx 
456def redis
789ghi postgres 
`}
          </Output>
        </CodeOutput>
        <CodeOutput title="Building commands">
          <Code language="bash">
            {`
echo -e \\
  'CONTAINER_ID   IMAGE       STATUS 
   123abc         nginx       Up 
   456def         redis       Up 
   789ghi         postgres    Exited' |
awk 'NR>1 {print $1, $2}' |
xargs -n2 sh -c 'echo \\
  docker rm \\
    --id "$1" \\
    --image "$2"' sh`}
          </Code>
          <Output>
            {`
docker rm --id 123abc --image 
    nginx
docker rm --id 456def --image 
    redis
docker rm --id 789ghi --image 
    postgres
`}
          </Output>
        </CodeOutput>
      </CodeOutputViewer>
      <p>
        Notice how <code>$1</code> and <code>$2</code> become the two columns. We're now creating real commands from rows!
      </p>
    </PageSection>
  );
}


function PageKubectlDeleteSection() {
  return (
    <PageSection>
      <h2>Step 6: One More Example</h2>
      <p>Simulated <code>kubectl get pods</code>:</p>
      <CodeOutputViewer>
        <CodeOutput title="Simulating kubectl get pods">
          <Code language="bash">
            {`
echo -e \\
  "NAMESPACE   POD         STATUS
   backend     api-1       Running
   backend     api-2       CrashLoopBackOff
   db          postgres-1  Running"`}
          </Code>
          <Output>
            {`
NAMESPACE   POD        STATUS
backend     api-1              Running
backend     api-2              CrashLoopBackOff
db          postgres-1         Running
`}
          </Output>
        </CodeOutput>
        <CodeOutput title="Extracting namespace and pod name">
          <Code language="bash">
            {`
echo -e \\
  "NAMESPACE   POD         STATUS
   backend     api-1       Running
   backend     api-2       CrashLoopBackOff
   db          postgres-1  Running" |
awk 'NR>1 {print $2, $1}' `}
          </Code>
          <Output>
            {`
api-1                backend
api-2                backend
postgres-1       db 
`}
          </Output>
        </CodeOutput>
        <CodeOutput title="Building delete commands">
          <Code language="bash">
            {`
echo -e \\
  "NAMESPACE   POD         STATUS
   backend     api-1       Running
   backend     api-2       CrashLoopBackOff
   db          postgres-1  Running" |
awk 'NR>1 {print $2, $1}' |
xargs -n2 sh -c 'echo \\
  kubectl delete pod "$1" \\
    -n "$2"' sh`}
          </Code>
          <Output>
            {`kubectl delete pod api-1 -n backend
kubectl delete pod api-2 -n backend
kubectl delete pod postgres-1 -n db
`}
          </Output>
        </CodeOutput>
      </CodeOutputViewer>
    </PageSection>
  );
}

function PageShTrickExplainedSection() {
  return (
    <PageSection>
      <h2>Step 7: The sh -c Quirk Explained</h2>
      <p>Why the extra sh at the end?</p>
      <CodeOutputViewer>
        <CodeOutput title="The sh -c Quirk">
          <Code language="bash">
            {`xargs -n2 sh -c 'echo "$1 - $2"' sh`}
          </Code>
        </CodeOutput>
      </CodeOutputViewer>
      <p>
        Here's the rule: <code>sh -c 'script' arg0 arg1 arg2</code>
      </p>
      <ul>
        <li><code>arg0</code> becomes <code>$0</code> (usually ignored).</li>
        <li><code>arg1</code> becomes <code>$1</code>.</li>
        <li><code>arg2</code> becomes <code>$2</code>.</li>
      </ul>
      <p>
        If we didn't add the extra <code>sh</code>, then our first <b>real</b> argument would slip into <code>$0</code> and vanish. The dummy keeps everything lined up.
      </p>
    </PageSection>
  );
}


function PageWrapUpSection() {
  return (
    <PageSection>
      <h2> Wrap-Up </h2>
      <ul>
        <li><code>awk</code> slices tables into columns.</li>
        <li><code>xargs</code> turns lists into commands.</li>
        <li><code>-n</code> controls batching (one row at a time).</li>
        <li><code>sh -c</code> lets you reorder and reference multiple args.</li>
      </ul>
      <p>
       Next time you see a table in your terminal, don't reach for the mouse. Pipe, slice, and command it straight away. That's the Unix way.
      </p>
    </PageSection>
  );
}
