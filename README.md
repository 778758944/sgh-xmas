# SunGlassHut 2015 Christmas 'Collect all glasses' Project
# Documentation
#
# Version 0.0.1-EN
# Last Update: 12 Dec 2015
# INZEN
===============================================================

# 1. Prereqs
===============================================================
Node.JS
MongoDB
===============================================================

# 2. Available Ports ==========================================

2.1 User-related (For both winners and players)

---POST /user/remainingChances---------------------------------
Description	: Gets remaining chances of the player
Method		: POST (x-www-urlencoded)
Input 		: (JSONObject)
{
	'openID'	: (String) WeChat User Identification
}
Return		: (JSONObject)
{
	'success'	: (Boolean) Operation Status
	'message'	: (String) Server-Returned message if error occured
	'data'		: (JSONObject)
	{
		'chances' : (Number) Remaining Chances
	}
}

----------------------------------------------------------------

2.2 Lottery related
---POST /lottery/startLottery-----------------------------------
Description	: Start Lottery
Method		: POST (x-www-urlencoded)
Input 		: --null--
Output 		: (JSONObject)
{
	{
		'lotteryID': (String) ID of the lottery
		'getPrice' : (boolean) Result of the prize draw. True if user gets the prize, otherwise False.
	}
}
-----------------------------------------------------------------