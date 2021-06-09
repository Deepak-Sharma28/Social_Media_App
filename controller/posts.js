module.exports = (Router, collection, ProfileModel, PostModel, Isverify, check, validationResult) => {

    //create a post for a particular user

    Router.post('/post', [Isverify, [
        check('text', 'text is required').not().isEmpty()
    ]], async(req, res) => {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        try {

            const user = await collection.findById(req.user.id).select('-password');

            const newPost = new PostModel({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();
            res.json(post);

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });

    //get all the posts

    Router.get('/posts', Isverify, async(req, res) => {
        try {
            const posts = await PostModel.find().sort({ date: -1 });
            res.json(posts);
        } catch (err) {
            console.error(err.message);
            res.status(400).send("Server Error");
        }
    });

    //get post by id

    Router.get('/posts/:user_id', Isverify, async(req, res) => {
        try {
            const posts = await PostModel.findById(req.params.user_id);
            if (!posts) {
                return res.status(500).json({ msg: "post not found" });
            }
            res.json(posts);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(500).json({ msg: "post not found" });

            }
            res.status(400).send("Server Error");
        }
    });

    //deleting a post by id

    Router.delete('/delete_post/:post_id', Isverify, async(req, res) => {
        try {
            const post = await PostModel.findById(req.params.post_id);
            console.log(post);
            if (!post) {
                return res.status(404).json({ msg: "Post not found" });
            }
            //check user

            if (post.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: "user is not authorized" });
            }
            await post.remove();

            res.json({ msg: "Post has removed" });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(500).json({ msg: "post not found" });
            }
            res.status(500).json("Server Error");
        }
    });


    //creating likes


    Router.put('/like/:post_id', Isverify, async(req, res) => {
        console.log(req.params.post_id);
        try {
            const post = await PostModel.findById(req.params.post_id);

            console.log(post);

            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({ msg: "Post is already liked" });
            }

            post.likes.unshift({
                user: req.user.id
            });

            await post.save();

            res.json(post.likes);

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    });


    //unlike the post



    Router.put('/unlike/:post_id', Isverify, async(req, res) => {
        console.log(req.params.post_id);
        try {
            const post = await PostModel.findById(req.params.post_id);

            if (post.likes.filter(like => like.user.toString() === req.user.id).length == 0) {
                return res.status(400).json({ msg: "Post is not been like yet" });
            }

            const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

            post.likes.splice(removeIndex, 1);

            await post.save();

            res.json(post.likes);


        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    });

    //adding a comment


    Router.post('/comment/:post_id', [Isverify, [
        check('text', 'text is required').not().isEmpty()
    ]], async(req, res) => {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await collection.findById(req.user.id).select('-password');
            const post = await PostModel.findById(req.params.post_id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };
            console.log(newComment);

            post.comments.unshift(newComment);
            console.log(post.comments);

            await post.save();
            res.json(post.comments);

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });


    //deleting a comment


    Router.delete('/comment/:post_id/:comment_id', Isverify, async(req, res) => {
        try {
            const post = await PostModel.findById(req.params.post_id);
            //pull out a comment

            const comment = post.comments.find(comment => comment.id === req.params.comment_id);
            //make sure comment exists

            if (!comment) {
                return res.status(404).json({ msg: "Comment does not exists" });
            }
            //check user

            if (comment.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: "unauthorised" });
            }

            //deleting a comment


            const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

            post.comments.splice(removeIndex, 1);

            await post.save();

            res.json(post.comments);

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });
};