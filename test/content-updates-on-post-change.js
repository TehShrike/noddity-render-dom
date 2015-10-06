var test = require('tape')

var makeTestState = require('./helpers/test-state')

test('contents update when the post changes', function(t) {
	var state = makeTestState()

	state.retrieval.addPost('post', { title: 'TEMPLAAAATE', markdown: false }, '{{>current}}')
	state.retrieval.addPost('file1.md', { title: 'Some title', date: new Date() }, 'This is a ::file2.md:: post that I *totally* wrote')
	state.retrieval.addPost('file2.md', { title: 'Some title', date: new Date() }, 'lol yeah ::herp|wat:: ::herp|huh::')
	state.retrieval.addPost('herp', { title: 'Some title', date: new Date(), markdown: false }, 'lookit {{1}}')

	state.retrieval.getPost('post', function(err, post) {
		t.notOk(err, 'no error')
		state.render(post, {}, function (err, setCurrent) {
			t.notOk(err, 'no error')
			state.retrieval.getPost('file1.md', function(err, childPost) {
				t.notOk(err, 'no error')
				setCurrent(childPost, function (err) {
					t.notOk(err, 'no error')
					setTimeout(function () {
						t.equal(setCurrent.ractive.toHTML(), '<p>This is a <p>lol yeah lookit wat lookit huh</p> post that I <em>totally</em> wrote</p>')

						state.retrieval.addPost('file2.md', { title: 'Some title', date: new Date(), lol: 'lolz' }, 'lol yeah ::herp|wat:: {{lol}}')
						setTimeout(function () {
							t.equal(setCurrent.ractive.toHTML(), '<p>This is a <p>lol yeah lookit wat lolz</p> post that I <em>totally</em> wrote</p>')

							t.end()
						}, 1000)
					}, 1000)
				})
			})
		})
	})
})