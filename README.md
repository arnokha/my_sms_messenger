# my_sms_messenger

## Test Url
https://jovial-begonia-f13fe7.netlify.app/

## Notes:
- Backend is deployed on a free tier in [Render](https://render.com/docs/free), which may produce considerable startup lag (up to ~1 minute) on the first message sent as the instance spins up. Subsequent messages should be processed relatively quickly. Spins down after 15 minutes of inactivity.
- session ID cookie is regenerated per refresh (not local storage)