document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts-container');
    let editingPostId = null;

    // Fetch and display posts
    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            const posts = await response.json();
            displayPosts(posts);
        } catch (error) {
            console.error('Failed to fetch posts:', error.message);
        }
    };

    // Display posts in the DOM
    const displayPosts = (posts) => {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <p><strong>Author:</strong> ${post.author}</p>
                <p><strong>Date:</strong> ${new Date(post.createdAt).toLocaleDateString()}</p>
                <button class="edit-btn" data-id="${post._id}">Edit</button>
                <button class="delete-btn" data-id="${post._id}">Delete</button>
            `;
            postsContainer.appendChild(postDiv);
        });

        // Add delete functionality to each post
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const postId = e.target.getAttribute('data-id');
                await deletePost(postId);
                fetchPosts(); // Refresh posts after deletion
            });
        });

        // Add edit functionality to each post
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = e.target.getAttribute('data-id');
                const post = posts.find(p => p._id === postId);

                // Populate form with current post data for editing
                document.getElementById('title').value = post.title;
                document.getElementById('content').value = post.content;
                document.getElementById('author').value = post.author;

                editingPostId = postId; // Save the ID of the post being edited
            });
        });
    };

    // Create or edit a post
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPost = {
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            author: document.getElementById('author').value
        };

        try {
            if (editingPostId) {
                // Update an existing post
                const response = await fetch(`/api/posts/${editingPostId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newPost)
                });

                if (!response.ok) {
                    const result = await response.json();
                    console.error('Error updating post:', result.message);
                    return;
                }

                console.log('Post updated successfully');
                editingPostId = null; // Clear editing state
            } else {
                // Create a new post
                await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newPost)
                });

                console.log('Post created successfully');
            }

            postForm.reset(); // Clear form after submission
            fetchPosts(); // Refresh posts list
        } catch (error) {
            console.error('Failed to submit post:', error.message);
        }
    });

    // Delete a post
    const deletePost = async (id) => {
        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const result = await response.json();
                console.error('Error deleting post:', result.message);
            } else {
                console.log('Post deleted successfully');
            }
        } catch (error) {
            console.error('Failed to delete post:', error.message);
        }
    };

    // Initial fetch to display posts
    fetchPosts();
});
