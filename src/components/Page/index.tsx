import { ComponentChildren } from 'preact';
import './style.css';

type Props = {
	children: ComponentChildren;
};

export function PageTitle({ children }: Props) {
  return <h1 class="page-title">{children}</h1>;
}

export function Page({ children }: Props) {
	return <main class="page">{children}</main>;
}
