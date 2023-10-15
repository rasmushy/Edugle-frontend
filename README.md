# [Edugle frontend](https://github.com/rasmushy/Edugle)

This school project aims to create a real-time, text-based chat platform that allows users to engage in conversations within various chat rooms. Built using technologies like GraphQL, Node.js, and a NoSQL database. Chat rooms will be created by site itself and users can change rooms with site navigation. Idea is that you will be randomised into next room with other user.

## Focus groups:

The target audience for this application is students, ranging from teenagers to adults who are looking to engage in conversations on diverse topics. Whether it's a casual chat, intellectual discourse, or hobby-based conversation, our platform aims to cater to various interests and demographics. Given its user-friendly design, the application is suitable for both tech-savvy individuals and those new to online chat platforms.

## Frontend explained

### Front end features

**This application needs more than one user to "work".** 

- It is a chat application where users can chat with each other. Users can also like or dislike other users. Users can also see their profile page and edit their description. Admins can see the admin panel where they can see all the users and their like count. They can also delete users and give other users admin rights.

- It is a chat application where users can chat with each other. Users can also like or dislike other users. Users can also see their profile page and edit their description. Admins can see the admin panel where they can see all the users and their like count. They can also delete users and give other users admin rights.

- It is a chat application where users can chat with each other. Users can also like or dislike other users. Users can also see their profile page and edit their description. Admins can see the admin panel where they can see all the users and their like count. They can also delete users and give other users admin rights.

### Landing page

![Our basic landing page](/media/indexPage.png "Index page")

### Pop ups for log in and sign up

![Our basic log in pop up](/media/logInPopUp.png "Log in pop up")
![Our basic sign up pop up](/media/signUpPopUp.png "Sign in pop up")

### Layout for chat window afer user logs in

![How the chat page looks like after user logs in](/media/mainPageLogin.png "Chat page")

Users have two options to choose from. They can either join a big chat room or random chat room. If they choose the big chat room they will be redirected to the chat room. If they choose random chat room they will be redirected to a random chat room.

### Chat room

### Chat roulette

![Chat roulette](/media/chatRoulette.png "Chat roulette")

Upon entering the chat roulette, the users are asked if they know the rules of talking to strangers. If they click yes, they will be redirected to the chat roulette queue. If they click no, they will be redirected to the main page.

There is a link for general rules of talking to strangers. The link will open in a new tab.

![Chat roulette queue](/media/queueWait.png "Chat roulette queue")

When the user is in the queue, they will be shown a message that they are in the queue and a button to leave the queue. If they click the button, they will be redirected to the main page.

![Chat roulette chat](/media/queueFind.png "Chat roulette chat find")

When other user is found, the UI will show a message that a user has been found and users will be directed into a chat room.

![Chat roulette chat](/media/talkingRoulette.png "Chat roulette chat")

When the user is in the chat room, they can see the other user's username and the chat history. They can also send messages to the other user. They can see other users activity status on the bottom left corner. If user is active, the circle will be green. If user lefts the chat, the circle will be red.

![Chat roulette chat](/media/userDisconnects.png "Chat roulette chat")

### Liking and disliking users

![Chat roulette chat](/media/likeUser.png "Chat roulette chat")

Users can like or dislike other users by clicking their name in the chat. 

### Profile page

![Chat roulette chat](/media/profile.png "Profile page")

Users can see their profile page by clicking Profile button in the top right corner. They can see their username, like count and description. By default the Description is empty, but users can change that anytime by clicking the Edit button in the top right corner!

### Admin page

![Chat roulette chat](/media/adminPanel.png "Admin panel")

Admins can see the admin panel by clicking Admin panel button in the top right corner. They can see all the users and their like count. They can also delete users by clicking the Delete button.
They can give other users admin rights by clicking the Give admin button. They can also remove admin rights by clicking the Remove admin button.

Admins can sort users by id, username, likecount and admin status.
