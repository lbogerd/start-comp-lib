import React from 'react'
import { Avatar } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, StatCard } from '../ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface UserProfilePopoverProps {
	children: React.ReactNode
	username?: string
	isKYCVerified?: boolean
	profilePicture?: string
	statusMessage?: string
	playerSince?: string
	leaderboardRank?: number
	totalWins?: number
	winStreak?: number
	favoriteGame?: string
	onlineStatus?: 'online' | 'away' | 'offline'
	// Callback functions for actions
	onChallenge?: () => void
	onAddFriend?: () => void
	onMute?: () => void
	onViewProfile?: () => void
}

const UserProfilePopover: React.FC<UserProfilePopoverProps> = ({
	children,
	username = 'PlayerOne',
	isKYCVerified = true,
	profilePicture,
	statusMessage = 'Ready to dominate the leaderboards! 🎮',
	playerSince = '2024.01',
	leaderboardRank = 4,
	totalWins = 127,
	winStreak = 8,
	favoriteGame = 'Crash',
	onlineStatus = 'online',
	onChallenge,
	onAddFriend,
	onMute,
	onViewProfile,
}) => {
	// Truncate status message for popover
	const truncatedStatus =
		statusMessage.length > 50
			? `${statusMessage.substring(0, 50)}...`
			: statusMessage

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				variant="dark"
				size="lg"
				className="w-80 overflow-hidden border-slate-600 bg-slate-900 p-0"
				sideOffset={8}
			>
				{/* Header with gradient background */}
				<div className="relative bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-4 pb-2">
					<div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />

					{/* Avatar and basic info */}
					<div className="relative z-10 flex items-start gap-3">
						<div className="relative">
							<Avatar
								src={profilePicture}
								size="lg"
								status={onlineStatus}
								showStatus={true}
							/>
							{/* KYC verification indicator */}
							{isKYCVerified && (
								<div className="absolute -top-1 -right-1 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 p-1 shadow-lg">
									<svg
										className="h-3 w-3 text-white"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								</div>
							)}
						</div>

						<div className="min-w-0 flex-1">
							{/* Username - ensure full visibility */}
							<div className="mb-2">
								<h3 className="text-lg leading-tight font-bold break-words text-white">
									{username}
								</h3>
							</div>

							{/* Status badges with better spacing */}
							<div className="mb-3 flex flex-wrap items-center gap-2">
								<Badge variant={onlineStatus} className="px-2 py-1 text-xs">
									{onlineStatus.toUpperCase()}
								</Badge>
								{isKYCVerified && (
									<Badge variant="verified" className="px-2 py-1 text-xs">
										✓ VERIFIED
									</Badge>
								)}
							</div>
						</div>
					</div>

					{/* Stats */}
					<div
						id="stats"
						className="mt-4 flex items-center justify-between rounded-lg bg-slate-800/80 px-3 py-2"
					>
						<div className="flex items-center gap-1">
							<span className="text-sm text-yellow-400">🏆</span>
							<span className="text-sm font-semibold text-white">
								#{leaderboardRank}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<span className="text-sm text-green-400">🎯</span>
							<span className="text-sm font-semibold text-white">
								{totalWins}W
							</span>
						</div>
						<div className="flex items-center gap-1">
							<span className="text-sm text-orange-400">🔥</span>
							<span className="text-sm font-semibold text-white">
								{winStreak}
							</span>
						</div>
					</div>
				</div>

				{/* Status and game info */}
				<div className="space-y-3 p-4 pt-2">
					{/* Status message */}
					<div className="text-sm text-slate-300 italic">
						"{truncatedStatus}"
					</div>

					{/* Game info */}
					<div className="flex justify-between text-xs text-slate-400">
						<span>Since {playerSince}</span>
						<span>
							Favorite:{' '}
							<span className="font-medium text-orange-400">
								{favoriteGame}
							</span>
						</span>
					</div>

					{/* Action buttons */}
					<div className="flex gap-2 pt-2">
						<Button
							variant="challenge"
							size="sm"
							className="flex-1 text-xs"
							onClick={onChallenge}
						>
							🤝 Challenge
						</Button>
						<Button
							variant="friend"
							size="sm"
							className="flex-1 text-xs"
							onClick={onAddFriend}
						>
							👥 Add
						</Button>
						<Button variant="mute" size="sm" className="px-2" onClick={onMute}>
							❌
						</Button>
					</div>

					{/* View full profile button */}
					<Button
						variant="secondary"
						size="sm"
						className="w-full text-xs"
						onClick={onViewProfile}
					>
						View Full Profile
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}

// Example usage component
const UserProfilePopoverExample = () => {
	return (
		<div className="min-h-screen bg-slate-900 p-8">
			<div className="mx-auto max-w-md space-y-4">
				<h2 className="mb-6 text-xl font-bold text-white">
					User Profile Popover Examples
				</h2>

				{/* Example in chat context */}
				<div className="rounded-lg bg-slate-800 p-4">
					<div className="text-sm text-slate-300">
						<UserProfilePopover
							username="CryptoGamer"
							isKYCVerified={true}
							onlineStatus="online"
							leaderboardRank={12}
							totalWins={89}
							winStreak={5}
							favoriteGame="Crash"
							statusMessage="Let's see who's the real crash master! 🚀"
							playerSince="2023.12"
							onChallenge={() => console.log('Challenge clicked')}
							onAddFriend={() => console.log('Add friend clicked')}
							onMute={() => console.log('Mute clicked')}
							onViewProfile={() => console.log('View profile clicked')}
						>
							<span className="cursor-pointer font-medium text-blue-400 hover:text-blue-300">
								@CryptoGamer
							</span>
						</UserProfilePopover>
						{': Just hit 2.5x on crash! Who wants to challenge me?'}
					</div>
				</div>

				<div className="rounded-lg bg-slate-800 p-4">
					<div className="text-sm text-slate-300">
						<UserProfilePopover
							username="ProPlayer99"
							isKYCVerified={false}
							onlineStatus="away"
							leaderboardRank={3}
							totalWins={156}
							winStreak={12}
							favoriteGame="Towers"
							statusMessage="Building my way to the top! 🏗️"
							playerSince="2024.01"
						>
							<span className="cursor-pointer font-medium text-green-400 hover:text-green-300">
								@ProPlayer99
							</span>
						</UserProfilePopover>
						{': Anyone up for a towers battle?'}
					</div>
				</div>

				<div className="rounded-lg bg-slate-800 p-4">
					<div className="text-sm text-slate-300">
						<UserProfilePopover
							username="LuckyWinner"
							isKYCVerified={true}
							onlineStatus="offline"
							leaderboardRank={1}
							totalWins={289}
							winStreak={23}
							favoriteGame="Spin"
							statusMessage="Luck is just preparation meeting opportunity! 🍀"
							playerSince="2023.08"
						>
							<span className="cursor-pointer font-medium text-purple-400 hover:text-purple-300">
								@LuckyWinner
							</span>
						</UserProfilePopover>
						{': GG everyone, see you tomorrow!'}
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserProfilePopover
export { UserProfilePopoverExample }
