import { Html, Head, Main, NextScript } from 'next/document'


export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,400&display=swap" rel="stylesheet" />
				{/* <link id="theme-link" href="/themes/lara-light-blue/theme.css" /> */}
				<meta charSet="UTF-8" />

			</Head>

			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
