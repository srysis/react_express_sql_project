# Forum

This a full-stack 'Forum' web-application, where users could discuss different topics and share images.


## Features

- Authentication/authorization system with the use of browser's local storage, HTTP-only cookies and JSON Web Tokens
- Create 'text' posts to express your opinions on a particular topic or 'image' posts to share an image you find interesting
- Dynamic 'Home' page that will load posts dynamically
- Customizable user profiles that allows them to edit their name, description and profile picture
- Users can edit their own posts in case they want to update it with new info
- View and read any post that has been made by other 'Forum' users
- Ability to view other users' profiles without logging in to see their activity
- Comment under any post to keep the discussion going
- Ability to like/dislike certain posts
- Ability to search for users if you want to find a particular user
- An option to delete your own post or profile
- Responsive layout


## Technical information

The Front-End side of this web-application was written using React.js framework.  
It uses 'Browser Router' from 'React-Router' package to allow client-side navigation, making it a Single Page Application, without a need for a page reload.
For 'requests' it uses Axios library. It also uses 'Axios requests interceptors' to verify every request from an authenticated user. 
Front-End side is hosted on Netlify.

The Back-End was written with Node.js with installed Express package to handle client requests and respond back with data, fetched from MySQL database in a desired format.
Authentication was implemented via HTTP-only cookies and JWT(JSON Web Tokens). User passwords are being hashed using 'bcrypt' package, used for data hashing.
Back-End as well as the remote image storage is hosted on Vercel.

Finally, as the database it utilizes the MySQL database hosted remotely on Aiven.


## Link

The latest version of this app can be viewed [here](https://srysis-forum.netlify.app/).