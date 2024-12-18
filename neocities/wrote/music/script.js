XML.template = page => `
	<img id="cover" src="https://f4.bcbits.com/img/${page.cover}_16.jpg">
	<header>
		<h2 id="name" title="${page.name}">${page.name}</h2>
		<dl>
			<dt>by</dt><dd>${page.artist}</dd>
			<dt>yapped</dt><dd>${new Date(page.date).toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "2-digit"}).toLowerCase()}</dd>
		</dl>
	</header>
	<main id="content">${page.content}</main>
`;
XML.nav(document.getElementById("page"), document.querySelectorAll("#index button"))