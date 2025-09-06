import { Code, CodeOutput, CodeOutputViewer, Output } from '../../components/CodeOutput';
import { Page, PageTitle } from '../../components/Page';
import { Tldr } from '../../components/Tldr';
import { Intro } from '../../components/Intro';

export function TurningTableRowsToCommands() {
  return (
    <Page>
      <PageTitle>
        Turning Rows into actionalbe elements in console
      </PageTitle>
      <PageTLDRSection />
      <PageIntroSection />
      <p>This is a placeholder for the blog post.</p>
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
