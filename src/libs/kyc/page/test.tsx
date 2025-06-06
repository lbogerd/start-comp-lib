import React, { useState } from 'react'
import { AchievementCard, type Achievement } from '../ui/achievement-card'
import { ActivityItem, type Activity } from '../ui/activity-item'
import { Avatar } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, StatCard } from '../ui/card'
import { Heading } from '../ui/heading'
import { TabContent, Tabs } from '../ui/tabs'

interface GameProfileProps {
	username?: string
	isKYCVerified?: boolean
	profilePicture?: string
	statusMessage?: string
	playerSince?: string
	leaderboardRank?: number
	gameMode?: string
	totalWins?: number
	winStreak?: number
	favoriteGame?: string
	onlineStatus?: 'online' | 'away' | 'offline'
}

const GameProfile: React.FC<GameProfileProps> = ({
	username = 'PlayerOne',
	isKYCVerified = true,
	profilePicture,
	statusMessage = 'Ready to dominate the leaderboards! 🎮',
	playerSince = '2024.01',
	leaderboardRank = 4,
	gameMode = 'crash',
	totalWins = 127,
	winStreak = 8,
	favoriteGame = 'Crash',
	onlineStatus = 'online',
}) => {
	const [activeTab, setActiveTab] = useState<
		'achievements' | 'stats' | 'social'
	>('achievements')

	// Enhanced achievements with progress and rarity - matching game themes
	const achievements: Achievement[] = [
		{
			name: 'CRASH MASTER',
			progress: 85,
			rarity: 'legendary',
			icon: '🚀',
			color: 'from-orange-400 to-red-500',
		},
		{
			name: 'COINFLIP KING',
			progress: 100,
			rarity: 'epic',
			icon: '🪙',
			color: 'from-yellow-400 to-orange-500',
		},
		{
			name: 'TOWER CLIMBER',
			progress: 60,
			rarity: 'rare',
			icon: '🏗️',
			color: 'from-green-400 to-emerald-500',
		},
		{
			name: 'DOZER DESTROYER',
			progress: 45,
			rarity: 'common',
			icon: '🚜',
			color: 'from-blue-400 to-cyan-500',
		},
		{
			name: 'SPIN WIZARD',
			progress: 90,
			rarity: 'legendary',
			icon: '🎰',
			color: 'from-purple-400 to-pink-500',
		},
	]

	// Social stats for engagement
	const socialStats = [
		{
			label: 'Followers',
			value: 42,
			trend: '+3',
			color: 'from-blue-400 to-cyan-400',
		},
		{
			label: 'Challenges Won',
			value: totalWins,
			trend: '+12',
			color: 'from-green-400 to-emerald-400',
		},
		{
			label: 'Current Streak',
			value: winStreak,
			trend: '🔥',
			color: 'from-orange-400 to-red-400',
		},
		{
			label: 'Games Played',
			value: 1247,
			trend: '+8',
			color: 'from-purple-400 to-pink-400',
		},
	]

	// Recent activity for social proof
	const recentActivity: Activity[] = [
		{ text: '🏆 Beat @CryptoGamer in Crash', color: 'border-l-orange-400' },
		{ text: '🎯 New personal best in Towers', color: 'border-l-green-400' },
		{ text: '🤝 Challenged @ProPlayer99', color: 'border-l-blue-400' },
		{ text: "⭐ Unlocked 'Crash Master' badge", color: 'border-l-purple-400' },
	]

	const tabs = [
		{ key: 'achievements', label: 'ACHIEVEMENTS', icon: '🏆' },
		{ key: 'stats', label: 'STATS', icon: '📊' },
		{ key: 'social', label: 'SOCIAL', icon: '👥' },
	]

	return (
		<div className="mx-auto min-h-dvh max-w-7xl p-4">
			{/* Header with enhanced profile */}
			<Card variant="gradient" className="mb-6 p-8">
				{/* Background decoration */}
				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>

				<div className="relative z-10 mb-8 flex items-start justify-between">
					{/* Enhanced Profile Picture */}
					<div className="relative">
						<Avatar
							src={profilePicture}
							size="xl"
							status={onlineStatus}
							showStatus={true}
						/>
						{/* KYC Star */}
						<div className="absolute -top-3 -right-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 p-2 shadow-lg shadow-blue-400/50">
							<svg
								className="h-8 w-8 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
						</div>
					</div>

					{/* Enhanced Username and Stats */}
					<div className="ml-8 flex-1">
						<div className="mb-6 flex items-center gap-4">
							<Heading level={1} variant="gradient">
								{username}
							</Heading>
							{isKYCVerified && <Badge variant="verified">✓ VERIFIED</Badge>}
							<Badge variant={onlineStatus}>{onlineStatus.toUpperCase()}</Badge>
						</div>

						{/* Quick Stats Row */}
						<div className="mb-6 grid grid-cols-4 gap-4">
							{socialStats.map((stat, index) => (
								<StatCard
									key={index}
									value={stat.value}
									label={stat.label}
									trend={stat.trend}
									color={stat.color}
								/>
							))}
						</div>

						{/* Status Message */}
						<div className="mb-6">
							<p className="text-xl font-medium text-slate-200 italic">
								"{statusMessage}"
							</p>
						</div>

						{/* Player Since */}
						<div className="text-right">
							<p className="font-medium text-slate-400">
								Gaming since {playerSince} • Favorite:{' '}
								<span className="font-bold text-orange-400">
									{favoriteGame}
								</span>
							</p>
						</div>
					</div>

					{/* Social Actions */}
					<div className="ml-8 space-y-4">
						<Button variant="challenge" size="lg" className="w-full">
							🤝 CHALLENGE
						</Button>
						<Button variant="friend" size="lg" className="w-full">
							👥 ADD FRIEND
						</Button>
						<Button variant="mute" size="lg" className="w-full">
							❌ MUTE
						</Button>
					</div>
				</div>
			</Card>

			{/* Tabbed Content Section */}
			<Card variant="gradient" className="p-8">
				{/* Tab Navigation */}
				<Tabs
					tabs={tabs}
					activeTab={activeTab}
					onTabChange={(tab) =>
						setActiveTab(tab as 'achievements' | 'stats' | 'social')
					}
					className="mb-8"
				/>

				{/* Tab Content */}
				<TabContent value="achievements" activeTab={activeTab}>
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
						{/* Achievements */}
						<div>
							<Heading level={3} icon="🏆" variant="section">
								<span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
									ACHIEVEMENTS
								</span>
							</Heading>
							<div className="space-y-4">
								{achievements.map((achievement, index) => (
									<AchievementCard key={index} achievement={achievement} />
								))}
							</div>
						</div>

						{/* Leaderboard & Recent Activity */}
						<div className="space-y-8">
							<div className="rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 p-6 shadow-lg shadow-yellow-400/20">
								<Heading level={3} icon="🥇" className="mb-4 text-yellow-300">
									LEADERBOARD POSITION
								</Heading>
								<div className="mb-2 text-5xl font-black text-white">
									#{leaderboardRank}
								</div>
								<div className="mb-4 text-lg font-bold text-yellow-200">
									in {gameMode.toUpperCase()}
								</div>
								<Button
									variant="challenge"
									className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600"
								>
									VIEW FULL RANKINGS
								</Button>
							</div>

							<div>
								<Heading level={3} icon="📈" variant="section">
									<span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
										RECENT ACTIVITY
									</span>
								</Heading>
								<div className="space-y-3">
									{recentActivity.map((activity, index) => (
										<ActivityItem key={index} activity={activity} />
									))}
								</div>
							</div>
						</div>
					</div>
				</TabContent>

				<TabContent value="stats" activeTab={activeTab}>
					<div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
						<StatCard
							value="1,247"
							label="Games Played"
							color="from-blue-400 to-cyan-400"
							icon="🎮"
						/>
						<StatCard
							value="68%"
							label="Win Rate"
							color="from-green-400 to-emerald-400"
							icon="🏆"
						/>
						<StatCard
							value="8"
							label="Win Streak"
							color="from-orange-400 to-red-400"
							icon="🔥"
						/>
						<StatCard
							value="2.4x"
							label="Best Multiplier"
							color="from-purple-400 to-pink-400"
							icon="💎"
						/>
					</div>
				</TabContent>

				<TabContent value="social" activeTab={activeTab}>
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
						<div>
							<Heading level={3} icon="👥" variant="section">
								<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
									FRIENDS ONLINE
								</span>
							</Heading>
							<div className="space-y-3">
								{['CryptoGamer', 'ProPlayer99', 'LuckyWinner'].map(
									(friend, index) => (
										<Card
											key={index}
											variant="glass"
											className="flex items-center justify-between p-4"
										>
											<div className="flex items-center gap-4">
												<Avatar
													size="sm"
													fallback={friend[0]}
													status="online"
													showStatus={true}
												/>
												<span className="font-bold text-white">{friend}</span>
											</div>
											<Button variant="challenge" size="sm">
												CHALLENGE
											</Button>
										</Card>
									),
								)}
							</div>
						</div>
						<div>
							<Heading level={3} icon="🎯" variant="section">
								<span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
									ACTIVE CHALLENGES
								</span>
							</Heading>
							<div className="space-y-4">
								<Card variant="default" className="p-6">
									<div className="mb-2 text-lg font-bold text-white">
										vs CryptoGamer
									</div>
									<div className="mb-3 font-medium text-slate-400">
										Best of 3 • Crash Game
									</div>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
										<span className="font-bold text-green-400">Your turn!</span>
									</div>
								</Card>
							</div>
						</div>
					</div>
				</TabContent>
			</Card>
		</div>
	)
}

export default GameProfile
