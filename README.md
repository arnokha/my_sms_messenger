# my_sms_messenger
Ref: [full-stack-exercise.md](https://bitbucket.org/cityhive/jobs/src/master/full-stack-eng/full-stack-exercise.md)

## Test Url
https://jovial-begonia-f13fe7.netlify.app/

## Notes:
- I implemented bonuses 2 and 3, but not bonus 1.
- The session ID cookie is regenerated per refresh (not local storage).
- The frontend polls for message status every five seconds.
- The backend is deployed on a free tier in [Render](https://render.com/docs/free), which may produce considerable startup lag (up to ~1 minute) on the first message sent as the instance spins up. Subsequent messages should be processed relatively quickly. The instance spins down after 15 minutes of inactivity.
- Twilio has a 50 daily message limit per day on the account I have, and it is exhausted as of Fri Oct 31st 10:20AM EST, so please wait until at least Sat Nov 1st 10:20AM EST to test the deployment.