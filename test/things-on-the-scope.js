var test = require('tape')

var makeTestState = require('./helpers/test-state')

test('post list is properly in scope', function(t) {
	var state = makeTestState()

	state.retrieval.addPost('file1.md', { title: 'Some title', date: new Date(1442361866264) }, ['<ol>{{#postList}}',
				'<li><a href="{{pathPrefix}}{{pagePathPrefix}}{{filename}}">{{title}}</a></li>',
			'{{/postList}}</ol>'].join('\n'))
	state.retrieval.addPost('file2.md', { title: 'Another title', date: new Date(1442361866265) }, 'lol yeah ::herp|wat:: ::herp|huh::')
	state.retrieval.addPost('herp', { title: 'Even moar title', date: new Date(1442361866266), markdown: false }, 'lookit {{1}}')

	state.retrieval.getPost('file1.md', function(err, post) {
		var data = {
			pathPrefix: '#!/',
			pagePathPrefix: 'post/'
		}
		state.render(post, data)

		setTimeout(function() {
			t.notOk(err)
			t.equal(document.querySelector('#test').innerHTML, ['<ol>',
				'<li><a href="#!/post/file1.md">Some title</a></li>',
				'<li><a href="#!/post/file2.md">Another title</a></li>',
				'<li><a href="#!/post/herp">Even moar title</a></li>',
				'</ol>'].join(''))
			t.end()
		}, 1000)
	})
})

test('post list is properly in scope in an embedded template, and the current filename is set at top and embedded levels', function(t) {
	var state = makeTestState()

	state.retrieval.addPost('file1.md', { title: 'Some title', date: new Date(1442361866264) }, ['<ol>{{#postList}}',
				'<li><a href="{{pathPrefix}}{{pagePathPrefix}}{{filename}}">{{title}}</a></li>',
			'{{/postList}}</ol>{{current}}'].join('\n'))
	state.retrieval.addPost('file2.md', { title: 'Another title', date: new Date(1442361866265) }, 'lol yeah ::herp|wat:: ::herp|huh::')
	state.retrieval.addPost('container', { title: 'Container', date: new Date(1442361866266), markdown: false }, '::file1.md::{{current}}')

	state.retrieval.getPost('container', function(err, post) {
		var data = {
			pathPrefix: '#!/',
			pagePathPrefix: 'post/'
		}
		state.render(post, data)

		setTimeout(function () {
			t.notOk(err)
			t.equal(document.querySelector('#test').innerHTML, [
				'<span class="noddity-template" data-noddity-post-file-name="file1.md" data-noddity-template-arguments="{}">',
					'<ol>',
						'<li><a href="#!/post/file1.md">Some title</a></li>',
						'<li><a href="#!/post/file2.md">Another title</a></li>',
						'<li><a href="#!/post/container">Container</a></li>',
					'</ol>',
				'container</span>container'].join(''))
			t.end()
		}, 1000)
	})
})
