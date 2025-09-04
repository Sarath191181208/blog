import { ComponentChildren } from 'preact';
import { useLocation } from 'preact-iso';
import { posts } from '../../blog';
import { Page } from '../Page';
import './style.css';

type Props = {
	children: ComponentChildren;
};

export function BlogPostLayout({ children }: Props) {
	const { url } = useLocation();
	const postIndex = posts.findIndex(post => post.path === url);
	const post = posts[postIndex];
	const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
	const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

	return (
		<Page>
			<article>
				{children}
			</article>
			<nav class="post-navigation">
				{prevPost && (
					<a href={prevPost.path} class="prev-post">
						<span>Previous</span>
						<h3>{prevPost.title}</h3>
					</a>
				)}
				{nextPost && (
					<a href={nextPost.path} class="next-post">
						<span>Next</span>
						<h3>{nextPost.title}</h3>
					</a>
				)}
			</nav>
		</Page>
	);
}
