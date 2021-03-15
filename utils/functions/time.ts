import {  format } from 'date-fns'

export const formatTimestamp = (timestamp: number): string => {
	const dateTimeStamp = new Date(timestamp)

	const now = new Date()

	if(dateTimeStamp.getMonth() === now.getMonth()){

		if(dateTimeStamp.getDate() === now.getDate()){
			return `today at ${format(dateTimeStamp, "h:mm a")}`
		}else if(now.getDate() -dateTimeStamp.getDate()  === 1){
			return `yesterday at ${format(dateTimeStamp, "h:mm a")}`
		}
	}

	return format(dateTimeStamp, "M/d/y")

}