
# [Mate](https://mate-project.onrender.com)

#### A full-stack chess application that allows user vs. user matches. Feel free to navigate through the website! Best way to enjoy is to queue up with a friend on separate devices and join a game together! Or, if testing on a single device, follow the guide below.

## Tech Stack
| Technology | Use Case                                             | 
| ---------- | ---------------------------------------------------- |
| Python     | Used for backend logic                               |
| JavaScript | Frontend interactivity                               |
| HTML       | Markup language for web development                  |
| CSS        | Stylesheet language for web development              |
| React      | Javascript library for building user interfaces      |
| Redux      | Javascript library for managing application state    |
| Flask      | Python web framework                                 |
| Socket.io  | Connections to facilitate real-time communication    |
| Git        | Version control system                               |
| Postgres   | Relational database management system                |
| SQLAlchemy | SQL toolkit and Object-Relational Mapping (ORM)      |
| Sqlite     | Lightweight in-process library                       |
| Node.js    | Javascript runtime environment                       |



## Features
- Chess Matches
- In-game chatting
- Real-time chess moves rendered to each client
- Viewing of previous matches
- Added friends
- Sending friend requests to other users
- Challenging friends to a match
- Draggable Chat-Box
- Simplistic/Modern UI

## Navigating through the website

### *Match making*
#### ( For testing on a single device ) : 
- Log-In or Signup     
- Open a new tab. ( if testing, open a separate "incognito" tab )
    - Log-In or Signup
- Click "Join Queue" on each tab    

![Image](https://cdn.discordapp.com/attachments/1138901705564622991/1138902230775382067/image.png)



### *Matches*
#### ( Once in a match ) : 
- Users can make moves and see the results on each screen in real time
- Plug in some headphones or turn up the audio to hear the sounds
- In-game chatting is always available
- Users can feel free to drag the Chat-Box to wherever they like 

![Image](https://cdn.discordapp.com/attachments/1016893880307814430/1138255318741155950/image.png)

#### ( Checkmate or Draw ) : 
- Once a checkmate or draw is reached, a modal will appear
- Users will have the option to click "Rematch" or "Close" to go back to the main menu

![Image](https://media.discordapp.net/attachments/1016893880307814430/1138260568898289795/image.png)


### *Match History*
#### ( In the main menu ) : 
- Users can view their past chess matches via "Match History"
- Each match is ordered by date, matches as white on the left side, matches as black on the right-side
- Choose a match to review and click the arrows to view each move that was played

![Image](https://cdn.discordapp.com/attachments/1138901705564622991/1138902794796015626/image.png)


### *Friend Requests*
#### ( By clicking the upper-right "Menu" ) : 
- Users can send friend requests via the search bar
- Every user that made an account with us exists in this search function
- Users can view their received requests in the "Manage Request" tab
- Users can either accept or decline the incoming friend request

![Image](https://cdn.discordapp.com/attachments/1138901705564622991/1138903302684287157/image.png)


### *Added Friends*
#### ( By clicking the upper-right "Menu" ) : 
- Users can add friends by accepting incoming friend-requests
- Users can view their friends in the "Added Friends" tab
- Users can remove friends if they wish

![Image](https://cdn.discordapp.com/attachments/1138901705564622991/1138903677042688000/image.png)

### *Challenge your Friends!*
#### ( By clicking the upper-right "Menu" ) : 
- Users can challenge their friends to a match
- Users can view their friends in the "Added Friends" tab, then send a challenge to them
- Users can view the incoming challenges in the "Challenges" tab
- Users have the option to accept or clear the challenge
- If the user accepts the new challenge, a new chess match will start between the challenger and receiver

![Image](https://cdn.discordapp.com/attachments/1138901705564622991/1138904085488222318/image.png)


## Run it locally

1. Clone the repository to your local machine:

```bash
git clone git@github.com:MattDavid99/Mate.git
```

2. Navigate to the root directory of the project and install the dependencies:
```
cd Mate
pip install -r requirements.txt
```

3. Go into the shell to start the backend server:
```
pipenv shell
flask run
```

4. Open a new terminal window, navigate to the frontend folder, and start the frontend application:
```
cd react-app
npm start
```

## Support

For support, email mattdavid37@gmail.com
