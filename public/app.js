document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts-container');
    let editingPostId = null;

    // Fetch and display posts
    const fetchPosts = async () => {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        displayPosts(posts);
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

    // Create a new post
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPost = {
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            author: document.getElementById('author').value
        };

        if (editingPostId) {
            // If editing, send a PUT request to update the post using the server-side route
            try {
                const response = await fetch(`/api/posts/${editingPostId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                });
    
                if (!response.ok) {
                    const result = await response.json();
                    console.error('Error updating post:', result.message);
                    return;
                }
    
                const updatedPost = await response.json();
                console.log('Post updated successfully:', updatedPost);
    
            } catch (error) {
                console.error('Failed to update post:', error.message);
            }
    
            editingPostId = null; // Clear the editing state after saving
        } else {
        await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        });
    }

        postForm.reset(); // Clear form
        fetchPosts(); // Refresh posts
    });

    // Delete a post
    const deletePost = async (id) => {
        await fetch(`/api/posts/${id}`, {
            method: 'DELETE'
        });
    };

    // Initial fetch to display posts
    fetchPosts();
});