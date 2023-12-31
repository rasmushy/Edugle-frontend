# [Edugle Website](https://edugle-fro.onrender.com/)

## Edugle: A Unique Text-Based Chat Platform
### Link to Website [Edugle](https://edugle-fro.onrender.com/) *
<b>* Website might take a minute to spin back up after not being used, because it is hosted on a free server, and spins the instance down after a while of inactivity.</b>

Edugle is an text-based chat platform that brings a fresh perspective to online conversations. This platform offers two key features:

- **Infinite Room Conversations**: Users can participate in unrestricted discussions within a large virtual chat room. Here, people from various backgrounds and interests can connect and engage in conversation without limitations.

- **Randomized Room Transition:** One of Edugle's standout features is its ability to pair users with random chat rooms and new conversation partners with just a click. It provides an exciting and spontaneous way to explore different topics and meet new people.

## Focus groups:

Our application primarily caters to the following focus groups:

- **Explorers of Random Conversations:** Edugle is the perfect platform for those who enjoy the unpredictability of meeting new people and having spontaneous, unscripted conversations. If you're open to chatting with individuals from all walks of life and embracing the element of surprise, Edugle welcomes you.

- **Community Seekers:** For individuals who appreciate the charm of a bustling and diverse online community, Edugle's infinite room is the place to be. Join the universal chat space where you can interact with many people simultaneously. It's an excellent space for those who love the idea of being part of a large and ever-evolving conversation.

- **Casual Chatters:** If you're looking for a place to have relaxed and informal conversations, Edugle is the ideal destination. Whether you're a teenager, a college student, or an adult, Edugle offers a laid-back environment where you can chat about various topics without any specific agenda.

- **Curious Minds:** Edugle is for those who are curious about different perspectives and enjoy learning from others. If you find joy in exploring the vast array of human experiences and insights, Edugle's random chat can be a treasure trove of knowledge and connection.

## Frontend explained

### Front end features

**This application needs more than one user to "work".** 

- It is a chat application where users can chat with each other. Users can also like or dislike other users. Users can also see their profile page and edit their description. Admins can see the admin panel where they can see all the users and their like count. They can also delete users and give other users admin rights.

### Landing page

![Our basic landing page](/media/landingPage.PNG "Index page")

### Pop ups for sign up

![Our basic sign up pop up](/media/signUp.PNG "Sign up pop up")

Login pop up is similar to sign up pop up.

### Layout for chat window afer user logs in

![How the chat page looks like after user logs in](/media/mainPageLogin.PNG "Chat page")

Users have two options to choose from. They can either join a big chat room or random chat room. If they choose the big chat room they will be redirected to the chat room. If they choose random chat room they will be redirected to a random chat room.

### Chat room

![Chat room](/media/bigChat.PNG "Chat room")

When the user is in the chat room, they can see the chat history and send messages to the chat. Users can like other users by clicking their name in the chat. 

### Chat roulette

![Chat roulette](/media/chatRoulette.PNG "Chat roulette")

Upon entering the chat roulette, the users are asked if they know the rules of talking to strangers. If they click yes, they will be redirected to the chat roulette queue. If they click no, they will be redirected to the main page.

There is a link for general rules of talking to strangers. The link will open in a new tab.

![Chat roulette queue](/media/queueWait.PNG "Chat roulette queue")

When the user is in the queue, they will be shown a message that they are in the queue and a button to leave the queue. If they click the button, they will be redirected to the main page.

![Chat roulette chat](/media/queueFind.PNG "Chat roulette chat find")

When other user is found, the UI will show a message that a user has been found and users will be directed into a chat room.

![Chat roulette chat](/media/talkingRoulette.PNG "Chat roulette chat")

When the user is in the chat room, they can see the other user's username and the chat history. They can also send messages to the other user. They can see other users activity status on the bottom left corner. If user is active, the circle will be green. If user lefts the chat, the circle will be red.

![Chat roulette chat](/media/userDisconnects.PNG "Chat roulette chat")

### Liking and disliking users

![Chat roulette chat](/media/likeUser.PNG "Chat roulette chat")

Users can like or dislike other users by clicking their name in the chat. 

### Profile page

![Chat roulette chat](/media/profile.PNG "Profile page")

Users can see their profile page by clicking Profile button in the top right corner. They can see their username, like count and description. By default the Description is empty, but users can change that anytime by clicking the Edit button in the top right corner!

### Admin page

![Chat roulette chat](/media/adminPanel.PNG "Admin panel")

Admins can see the admin panel by clicking Admin panel button in the top right corner. They can see all the users and their like count. They can also delete users by clicking the Delete button.
They can give other users admin rights by clicking the Give admin button. They can also remove admin rights by clicking the Remove admin button.

Admins can sort users by id, username, likecount and admin status.

