import { ComponentChildren } from 'preact';
import './style.css';

type Props = {
	children: ComponentChildren;
};

export function Page({ children }: Props) {
	return <main class="page">{children}</main>;
}
