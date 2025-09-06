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
    <Code language='bash'>
      {`
kubectl get pods
  | awk 'NR>1 {print $1, $2}' 
  | xargs -n2 sh -c 'kubectl delete pod "$1" -n "$2"' sh`}
    </Code>

    <code>command</code> and then <code>awk</code> to extract, <code>xargs</code> to apply you args and <code>sh -c</code> to reorder you args

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
    <p>Let's say you have a table like the following: </p>
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
    </p>
  </PageSection>
}

function PageExtractingMultipleColumnsSection() {
  return (
    <PageSection>
      <h2>Step 2: Extracting Multiple Columns</h2>
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
      <p>You can grab as many columns as you want ($2, $4 = Name + City).</p>
    </PageSection>
  );
}

function PageFeedingIntoCommandSection() {
  return (
    <PageSection>
      <h2>Step 3: Feeding into a Command</h2>
      <p>Let's say we want to use just the names as arguments to another command.</p>
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
      <p><code>xargs</code> takes the list and appends it to the command.
        <br />
        We ideally want to run a command for each arg we have received, How to do this ?</p>
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
      <h2>Step 8: The sh -c Quirk Explained</h2>
      <p>Why the extra sh at the end?</p>
      <CodeOutputViewer>
        <CodeOutput title="The sh -c Quirk">
          <Code language="bash">
            {`xargs -n2 sh -c 'echo "$1 - $2"' sh`}
          </Code>
        </CodeOutput>
      </CodeOutputViewer>
      <p>sh -c '...' arg0 arg1 arg2 → here, arg0 becomes $0, arg1 becomes $1, etc.</p>
      <p>Without the dummy sh, your first real arg becomes $0 and disappears.</p>
      <p>By adding a dummy arg, the real data lines up with $1, $2, …</p>
    </PageSection>
  );
}


function PageWrapUpSection() {
  return (
    <PageSection>
      <h2>Wrap-Up</h2>
      <ul>
        <li>Use awk to slice table output into the columns you want</li>
        <li>Pipe into xargs to build commands</li>
        <li>Use sh -c when you need multiple args, custom ordering, or reuse</li>
        <li>Always add a dummy arg after the script in sh -c</li>
      </ul>
      <p>Next time you see a table in your terminal, you'll know how to turn it straight into commands</p>
    </PageSection>
  );
}
