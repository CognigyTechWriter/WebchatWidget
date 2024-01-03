import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import { Typography } from "@cognigy/chat-components";
import RatingDown from "../../../assets/rating-down-16px.svg";
import RatingUp from "../../../assets/rating-up-16px.svg";
import IconButton from "../IconButton";
import PrimaryButton from "../PrimaryButton";
import { createNotification } from "../Notifications";
import MultilineInput from "../MultilineInput";

const RatingWidgetRoot = styled.div(() => ({
	width: "100%",
	height: "310px",
	display: "flex",
	flexDirection: "column",
	padding: "20px 0",
	gap: 24,
}));

const RatingButtonContainer = styled.div(() => ({
	width: "100%",
	display: "flex",
	alignItems: "flex-start",
	gap: 8,
}));

const RatingButton = styled(IconButton)(({ theme, selected }) => ({
	background: selected ? theme.primaryColor : theme.black95,
	display: "flex",
	padding: "12px 16px",
	justifyContent: "center",
	alignItems: "center",
	gap: 16,
	borderRadius: 15,
	"svg": {
		width: 16,
		height: 16,
	},
	"&:focus": {
		outline: "none",
		boxShadow: `inset 0 0 0 2px ${theme.primaryColor}`,
	},
}));

const RatingUpIcon = styled(RatingUp)(({ theme, selected }) => ({
	"path": {
		fill: selected ? theme.black95: theme.black10,
	}
}));

const RatingDownIcon = styled(RatingDown)(({ theme, selected }) => ({
	"path": {
		fill: selected ? theme.black95: theme.black10,
	}
}));

const RatingTextContainer = styled.div(() => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "flex-start",
	gap: 16,
	alignSelf: "stretch",
}));

const SendButton = styled(PrimaryButton)(({ theme }) => ({
	width: "100%",
	"&:disabled": {
		opacity: 1,
	},
	"&:focus": {
		outline: "none",
		border: `2px solid ${theme.primaryColor}`,
	},
}));

type TRatingValue = 1 | -1 | null;
interface IOnSendRatingProps {
	rating: TRatingValue;
	comment: string;
}
interface IRatingWidgetProps {
	ratingTitleText: string;
	ratingCommentText: string;
	onSendRating: (props: IOnSendRatingProps) => void;
}

export const RatingWidget = (props: IRatingWidgetProps) => {
	const { ratingTitleText, ratingCommentText, onSendRating } = props;
	const [ratingValue, setRatingValue] = useState<TRatingValue>(null);
	const [ratingText, setRatingText] = useState("");

	const ratingInputRef = useRef(null);
	const sendRatingButtonRef = useRef(null);

	const disableSendButton = ratingValue !== -1 && ratingValue !== 1;

	const handleSubmitFeedback = () => {
		onSendRating({rating: ratingValue, comment: ratingText});
		setTimeout(() => createNotification("Your feedback was submitted."), 500);
		setRatingValue(null);
		setRatingText("");
	}

	return (
		<RatingWidgetRoot className="webchat-chat-options-root">
			<Typography variant="title1-semibold" component="div">{ratingTitleText}</Typography>
			<RatingButtonContainer className="webchat-rating-widget-content-container">
				<RatingButton
					onClick={() => setRatingValue(1)}
					className="webchat-rating-widget-thumbs-up-button"
					aria-pressed={ratingValue === 1}
					aria-label="Thumbs Up"
					selected={ratingValue === 1}
				> 
					<RatingUpIcon selected={ratingValue === 1}/>
				</RatingButton>
				<RatingButton
					onClick={() => setRatingValue(-1)}
					className="webchat-rating-widget-thumbs-down-button"
					aria-pressed={ratingValue === -1}
					aria-label="Thumbs Down"
					selected={ratingValue === -1}
				>                    
					<RatingDownIcon selected={ratingValue === -1}/>                    
				</RatingButton>
			</RatingButtonContainer>
			<RatingTextContainer>
				<MultilineInput
					data-test="rating-input"
					value={ratingText}
					disabled={ratingValue === null}
					onChange={(e) => setRatingText(e.target.value)}
					className="webchat-rating-widget-comment-input-field"
					rows={4}
					ref={ratingInputRef}
					placeholder={ratingCommentText}
				/>
				<SendButton
					className={`webchat-rating-widget-send-button ${disableSendButton ? "disabled" : "active"}`}
					disabled={disableSendButton}
					onClick={handleSubmitFeedback}
					ref={sendRatingButtonRef}
				>
					Send feedback
				</SendButton>
			</RatingTextContainer>
		</RatingWidgetRoot>
	);
};
