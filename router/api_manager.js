const { default: axios } = require("axios");
const express = require("express");
const { userData } = require(".");
const router = express.Router();

// 닉네임으로 유저 데이터 조회
router.get("/api/v1/userdata/:nickname", async (req, res) => {
	try {
		const userInfo = await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURI(req.params.nickname)}?api_key=${process.env.API_KEY}`)

		const userdata = {
			puuid: userInfo.data.puuid,
			name: userInfo.data.name,
			summonerId: userInfo.data.id,
			summonerLevel: userInfo.data.summonerLevel,
			profileIconId: userInfo.data.profileIconId,
		};

		res.send(userdata);

	} catch (err) {
		return ("ERROR !!")
	}
});

// 최근 10 게임 조회
router.get("/api/v1/history/:puuid", async (req, res) => {
	try {
		const Info = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${req.params.puuid}/ids?start=0&count=10&api_key=${process.env.API_KEY}`);

		res.send(Info.data);

	} catch (err) {
		return ("ERROR !!")
	}
})

// 인게임 상세 정보 조회
router.get("/api/v1/match/:matchId", async (req, res) => {
	try {
		const Info = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${req.params.matchId}?api_key=${process.env.API_KEY}`);

		const data = {
			gameDuration: Info.data.info.gameDuration,
			mapId: Info.data.info.mapId,
			participants: Info.data.info.participants,
		}

		res.send(data);

	} catch (err) {
		return ("ERROR !!")
	}
})

// 랭크 조회
router.get("/api/v1/tier/:summonerId", async (req, res) => {
	try {
		const Info = await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${req.params.summonerId}?api_key=${process.env.API_KEY}`);
		
		const data = {
			solo: {
				queueType: "",
				tier: "",
				rank: "",
				leaguePoints: 0,
				wins: 0,
				losses: 0,
				winrate: 0.0
			},
			flex: {
				queueType: "",
				tier: "",
				rank: "",
				leaguePoints: 0,
				wins: 0,
				losses: 0,
				winrate: 0.0
			}
		};
		// JSON 데이터중 원하는 데이터만 추출
		Info.data.forEach(element => {
			if ("RANKED_FLEX_SR" === element.queueType) {
				data.flex.queueType = element.queueType;
				data.flex.tier = element.tier;
				data.flex.rank = element.rank;
				data.flex.leaguePoints = element.leaguePoints;
				data.flex.wins = element.wins;
				data.flex.losses = element.losses;
				data.flex.winrate = element.wins / (element.wins + element.losses);
			}
			else if ("RANKED_SOLO_5x5" === element.queueType) {
				data.solo.queueType = element.queueType;
				data.solo.tier = element.tier;
				data.solo.rank = element.rank;
				data.solo.leaguePoints = element.leaguePoints;
				data.solo.wins = element.wins;
				data.solo.losses = element.losses;
				data.solo.winrate = element.wins / (element.wins + element.losses);
			}
		});

		res.send(data);

	} catch (err) {
		return ("ERROR !!")
	}
})

module.exports = router;