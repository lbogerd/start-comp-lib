// made by gemini-2.5-pro-exp-03-25

'use client'

import { useCallback, useEffect, useState } from 'react'

interface CalendarProps {
	onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void
	initialStartDate?: Date | null
	initialEndDate?: Date | null
}

export const Calendar: React.FC<CalendarProps> = ({
	onDateRangeChange,
	initialStartDate = null,
	initialEndDate = null,
}) => {
	const [currentDateToDisplay, setCurrentDateToDisplay] = useState(
		initialStartDate ? new Date(initialStartDate) : new Date(),
	)
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [endDate, setEndDate] = useState<Date | null>(null)
	const [hoverDate, setHoverDate] = useState<Date | null>(null)

	useEffect(() => {
		const normalizedInitialStart = initialStartDate
			? new Date(initialStartDate)
			: null
		if (normalizedInitialStart) {
			normalizedInitialStart.setHours(0, 0, 0, 0)
		}
		setStartDate(normalizedInitialStart)

		const normalizedInitialEnd = initialEndDate
			? new Date(initialEndDate)
			: null
		if (normalizedInitialEnd) {
			normalizedInitialEnd.setHours(0, 0, 0, 0)
		}
		setEndDate(normalizedInitialEnd)

		// Adjust view if initialStartDate is provided
		if (normalizedInitialStart) {
			setCurrentDateToDisplay(new Date(normalizedInitialStart))
		} else {
			setCurrentDateToDisplay(new Date()) // Default to current month if no initial start date
		}
	}, [initialStartDate, initialEndDate])

	const getDaysInMonth = useCallback((year: number, month: number): number => {
		return new Date(year, month + 1, 0).getDate()
	}, [])

	const getFirstDayOfMonth = useCallback(
		(year: number, month: number): number => {
			return new Date(year, month, 1).getDay() // 0 (Sun) - 6 (Sat)
		},
		[],
	)

	const addMonths = useCallback(
		(date: Date, months: number): Date => {
			const newDate = new Date(date)
			const originalDay = newDate.getDate()
			newDate.setDate(1) // Avoid month overflow issues by setting day to 1st
			newDate.setMonth(newDate.getMonth() + months)
			const lastDayOfNewMonth = getDaysInMonth(
				newDate.getFullYear(),
				newDate.getMonth(),
			)
			newDate.setDate(Math.min(originalDay, lastDayOfNewMonth))
			return newDate
		},
		[getDaysInMonth],
	)

	const subMonths = useCallback(
		(date: Date, months: number): Date => {
			const newDate = new Date(date)
			const originalDay = newDate.getDate()
			newDate.setDate(1) // Avoid month overflow issues
			newDate.setMonth(newDate.getMonth() - months)
			const lastDayOfNewMonth = getDaysInMonth(
				newDate.getFullYear(),
				newDate.getMonth(),
			)
			newDate.setDate(Math.min(originalDay, lastDayOfNewMonth))
			return newDate
		},
		[getDaysInMonth],
	)

	useEffect(() => {
		if (onDateRangeChange) {
			// Call only when a range is finalized or fully cleared
			if ((startDate && endDate) || (!startDate && !endDate)) {
				onDateRangeChange(startDate, endDate)
			}
		}
	}, [startDate, endDate, onDateRangeChange])

	const handlePrevMonths = () => {
		setCurrentDateToDisplay((prev) => subMonths(prev, 2))
	}

	const handleNextMonths = () => {
		setCurrentDateToDisplay((prev) => addMonths(prev, 2))
	}

	const handleDateClick = (dayClicked: Date) => {
		const normalizedDay = new Date(dayClicked)
		normalizedDay.setHours(0, 0, 0, 0)

		let newStart = startDate
		let newEnd = endDate

		if (!newStart || (newStart && newEnd)) {
			newStart = normalizedDay
			newEnd = null
		} else {
			if (normalizedDay.getTime() === newStart.getTime()) {
				newStart = null
				newEnd = null
			} else if (normalizedDay < newStart) {
				newEnd = newStart
				newStart = normalizedDay
			} else {
				newEnd = normalizedDay
			}
		}
		setHoverDate(null)
		setStartDate(newStart)
		setEndDate(newEnd)
	}

	const handleDateHover = (dayHovered: Date) => {
		if (startDate && !endDate) {
			const normalizedHoverDay = new Date(dayHovered)
			normalizedHoverDay.setHours(0, 0, 0, 0)
			setHoverDate(normalizedHoverDay)
		}
	}

	const renderMonth = (dateToDisplay: Date) => {
		const year = dateToDisplay.getFullYear()
		const month = dateToDisplay.getMonth()
		const monthName = dateToDisplay.toLocaleString('default', { month: 'long' })

		const daysInCurrentMonth = getDaysInMonth(year, month)
		const firstDayOfMonth = getFirstDayOfMonth(year, month)

		const dayCells = []

		for (let i = 0; i < firstDayOfMonth; i++) {
			dayCells.push(
				<div
					key={`empty-start-${month}-${i}`}
					className="h-10 w-10 border border-transparent"
				></div>,
			)
		}

		for (let day = 1; day <= daysInCurrentMonth; day++) {
			const currentDateObj = new Date(year, month, day)
			currentDateObj.setHours(0, 0, 0, 0)
			const currentTime = currentDateObj.getTime()

			const today = new Date()
			today.setHours(0, 0, 0, 0)
			const isTodayDate = currentTime === today.getTime()

			let classList = [
				'p-2',
				'text-center',
				'cursor-pointer',
				'transition-colors',
				'duration-150',
				'ease-in-out',
				'box-border',
				'h-10',
				'w-10',
				'flex',
				'items-center',
				'justify-center',
			]
			let currentBg = 'bg-transparent'
			let currentTextColor = 'text-gray-700'
			let currentRounding = 'rounded-md'
			let currentRing = ''

			if (startDate) {
				const sTime = startDate.getTime()
				if (endDate) {
					const eTime = endDate.getTime()
					const minTime = Math.min(sTime, eTime)
					const maxTime = Math.max(sTime, eTime)

					if (currentTime >= minTime && currentTime <= maxTime) {
						currentTextColor = 'text-white'
						if (currentTime === minTime && currentTime === maxTime) {
							currentBg = 'bg-blue-600'
							currentRounding = 'rounded-full'
						} else if (currentTime === minTime) {
							currentBg = 'bg-blue-600'
							currentRounding = 'rounded-l-full'
						} else if (currentTime === maxTime) {
							currentBg = 'bg-blue-600'
							currentRounding = 'rounded-r-full'
						} else {
							currentBg = 'bg-blue-400'
							currentRounding = 'rounded-none'
						}
					}
				} else {
					if (currentTime === sTime) {
						currentBg = 'bg-blue-600'
						currentTextColor = 'text-white'
						currentRounding = 'rounded-full'
					} else if (hoverDate) {
						const hTime = hoverDate.getTime()
						const minProspective = Math.min(sTime, hTime)
						const maxProspective = Math.max(sTime, hTime)

						if (currentTime === hTime && hTime !== sTime) {
							currentBg = 'bg-blue-500'
							currentTextColor = 'text-white'
							currentRounding =
								hTime > sTime ? 'rounded-r-full' : 'rounded-l-full'
						} else if (
							currentTime > minProspective &&
							currentTime < maxProspective
						) {
							currentBg = 'bg-blue-200'
							currentTextColor = 'text-blue-800'
							currentRounding = 'rounded-none'
						}
					}
				}
			}

			if (isTodayDate) {
				if (currentBg === 'bg-transparent') {
					currentRing = 'ring-2 ring-offset-1 ring-blue-500'
					if (currentTextColor === 'text-gray-700')
						currentTextColor = 'text-blue-600 font-semibold'
				} else if (currentBg === 'bg-blue-200') {
					currentRing = 'ring-1 ring-blue-400'
				}
			}

			if (currentBg === 'bg-transparent') {
				classList.push('hover:bg-gray-100')
			}

			classList.push(currentBg, currentTextColor, currentRounding, currentRing)
			const finalCellStyle = classList
				.filter((c) => c && c !== 'bg-transparent')
				.join(' ')

			dayCells.push(
				<div
					key={`${year}-${month}-${day}`}
					className={finalCellStyle}
					onClick={() => handleDateClick(new Date(year, month, day))}
					onMouseEnter={() => handleDateHover(new Date(year, month, day))}
				>
					{day}
				</div>,
			)
		}

		return (
			<div className="w-full p-3 md:w-auto md:flex-1 md:p-4">
				{' '}
				{/* Adjusted for flex layout */}
				<h3 className="mb-3 text-center text-lg font-semibold">
					{monthName} {year}
				</h3>
				<div className="grid grid-cols-7 gap-px border border-gray-200 bg-gray-100 text-sm">
					{' '}
					{/* Added gap-px and borders */}
					{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
						<div
							key={dayName}
							className="flex h-8 items-center justify-center bg-gray-50 py-2 text-center font-medium text-gray-500"
						>
							{dayName.substring(0, 2)}
						</div>
					))}
					{dayCells.map((cell, index) => (
						<div key={index} className="bg-white">
							{cell}
						</div>
					))}{' '}
					{/* Wrap cells for borders */}
				</div>
			</div>
		)
	}

	const firstMonthDate = currentDateToDisplay
	const secondMonthDate = addMonths(currentDateToDisplay, 1)

	return (
		<div className="mx-auto max-w-full rounded-lg bg-white p-2 shadow-lg sm:p-4 md:max-w-xl lg:max-w-2xl">
			<div className="mb-4 flex items-center justify-between px-2 sm:px-4">
				<button
					onClick={handlePrevMonths}
					className="rounded-md bg-gray-200 px-3 py-1.5 text-gray-700 transition-colors hover:bg-gray-300"
					aria-label="Previous two months"
				>
					&lt;
				</button>
				<div className="text-md px-2 text-center font-semibold text-gray-800 sm:text-lg">
					{firstMonthDate.toLocaleString('default', {
						month: 'long',
						year: 'numeric',
					})}
					<span className="mx-1 sm:mx-2">&ndash;</span>
					{secondMonthDate.toLocaleString('default', {
						month: 'long',
						year: 'numeric',
					})}
				</div>
				<button
					onClick={handleNextMonths}
					className="rounded-md bg-gray-200 px-3 py-1.5 text-gray-700 transition-colors hover:bg-gray-300"
					aria-label="Next two months"
				>
					&gt;
				</button>
			</div>
			<div
				className="flex flex-col md:flex-row md:space-x-4"
				onMouseLeave={() => {
					if (startDate && !endDate) setHoverDate(null)
				}}
			>
				{renderMonth(firstMonthDate)}
				{renderMonth(secondMonthDate)}
			</div>
			{(startDate || initialStartDate) && ( // Show if there's a current selection or an initial one was provided
				<div className="mt-4 border-t p-3 text-sm text-gray-600 sm:p-4">
					<p>
						Selected Start:{' '}
						<span className="font-medium text-gray-800">
							{startDate ? startDate.toLocaleDateString() : 'Not set'}
						</span>
					</p>
					<p>
						Selected End:{' '}
						<span className="font-medium text-gray-800">
							{endDate
								? endDate.toLocaleDateString()
								: startDate
									? 'Not set'
									: ''}
						</span>
					</p>
				</div>
			)}
		</div>
	)
}
