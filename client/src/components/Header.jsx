import { Link, useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { AiOutlineMenu } from 'react-icons/ai';
import { HiUserCircle, HiMenu } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { getToken, getUserType, logout } from '../utils/utils';
import Selector from './Selector';
import TableDatePicker from './DatePicker';
import Logo from '../assets/logo.png';
import { reset, setLocation, setFruit } from '../store/OptionSlice';

const StyledHeader = styled.header`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.2rem 5.5rem;
	box-sizing: border-box;
	border-bottom: 1px solid lightgray;
`;

const StyledSearchBar = styled.div`
	border-radius: 20px;
	height: 45px;
	width: 20%;
	position: relative;
	cursor: pointer;
	border:1px solid rgba(0, 0, 0, 0.18);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);

	> svg {
		position: absolute;
		top: 7px;
		right: 10px;
		background: #f4d815;
		border-radius: 50%;
		padding: 2px;
		color:#fff;
	}

	> P {
		color: gray;
		position: absolute;
		top: 50%;
		left: 20px;
		transform: translateY(-50%);
	}

	${(props) =>
		props.toggle &&
		css`
			display: none;
		`}
`;

const ActiveSearchBar = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 40%;
	position: relative;

	button {
		border: 0;
		cursor: pointer;
		background-color: white;
		margin: 0 40px;
		font-size: 30px;

		&:hover {
			text-decoration: underline;
		}
	}

	& > div {
		display: flex;
		justify-content: space-around;
		width: 100%;
		border-radius: 20px;
	}
`;

const SearchOption = styled.div`
	display: flex;
	align-items: center;
	padding: 20px 0px;
	box-shadow: -1px -1px 10px rgba(0, 0, 0, 0.18);
	border: 1px solid rgba(0, 0, 0, 0.18);
	border-radius: 20px;

	& > div {
		display: flex;
		align-items: center;
		border-radius: 20px;
		height: 100%;
		z-index: 9999;
		position: relative;
	}

	& > div:hover {
		cursor: pointer;
		font-weight:700;
		&:after {
			content:'';
			height:3px;
			width:100%;
			background-color: #f4d815;
			position: absolute;
			bottom:0px;
	}
`;

const SearchMenu = ({ children }) => {
	return <SearchContainer>{children}</SearchContainer>;
};

const SearchContainer = styled.div`
	position: absolute;
	border: 1px solid #c3c2c2;
	background-color: white;
	top: 100px;
	z-index: 9999;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
`;

const StyledNav = styled.div`
	border-radius: 20px;
	border: 1px solid #c3c2c2;
	padding: 3px;

	${(props) =>
		props.toggle &&
		css`
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
			transition: box-shadow 0.2s ease;
		`}
	button {
		border: none;
		background: transparent;
		display: flex;
		align-items: center;
	}

	svg + svg {
		padding-left: 3px;
		color:#f4d815
	}
`;

const StyledMenu = styled.div`
	display: none;
	${(props) =>
		props.toggle &&
		css`
			display: block;
		`}
	position: absolute;
	top: 10%;
	right: 5%;
	background: #fff;
	border-radius: 10px;
	box-shadow: -1px -1px 10px rgba(0, 0, 0, 0.18);
	border: 1px solid rgba(0, 0, 0, 0.18);
	width: 230px;
	padding: 1% 0;
	box-sizing: border-box;
	z-index: 2;
`;
const StyledLink = styled(Link)`
	padding: 5%;
	color:#000;
	text-decoration: none;

	&:hover {
		background: lightgray;
		color:#000;
	}
`;

const StyledBtn = styled.button`
	background: none;
	border: none;
	padding: 5%;
	font-size: 1rem;
	width: 100%;
	text-align: left;

	&:hover {
		background: lightgray;
	}
`;

const StyledLogout = styled.div`
	&::before {
		content: '';
		display: block;
		height: 1px;
		width: 100%;
		background: lightgray;
		margin: 5px 0px;
	}
`;
const LogoContainer = styled.div`
	cursor: pointer;
`;
const LogoImg = styled.img`
	width: 4rem;
	height: 4rem;
`;
const beforeLoginList = [
	{
		id: 1,
		name: '?????????',
		path: '/login',
	},
	{
		id: 2,
		name: '????????????',
		path: '/register',
	},
];

const afterLoginList = [
	{
		id: 3,
		name: '???????????????',
		path: '/mypage',
	},
	{
		id: 4,
		name: '????????????',
		path: '/mypage/reservation',
	},
	{
		id: 5,
		name: '????????????',
		path: '/mypage/review',
	},
	{
		id: 6,
		name: '?????????',
		path: '/favorite',
	},
];

const farmerLoginList = [
	{
		id: 7,
		name: '??????????????????',
		path: '/farm',
	},
	{
		id: 8,
		name: '?????????????????????',
		path: '/farm/timetable',
	},
	{
		id: 9,
		name: '????????????',
		path: '/farm/reservation',
	},
	{
		id: 10,
		name: '?????? ??????',
		path: '/farm/review',
	},
];

const Header = () => {
	const dispatch = useDispatch();

	const [isOpenSearchBar, setIsOpenSearchBar] = useState(false); // ?????? ??? ??????
	const [searchOption, setSearchOption] = useState('location'); // ??????, ?????? ??????
	const [option, setOption] = useState(null); // ?????? ?????? ??????

	const [toggleMenu, setToggleMenu] = useState(false);
	const token = getToken();
	const userType = getUserType();
	const navigate = useNavigate();
	const params = useParams();
	const ref = useRef();
	const searchRef = useRef(); // ?????? ??? ??????

	const handleClickOutSide = (e) => {
		if (toggleMenu && !ref.current.contains(e.target)) {
			setToggleMenu(false);
		}
		if (isOpenSearchBar && !searchRef.current.contains(e.target)) {
			setIsOpenSearchBar(false); // ?????? ??? ??????
			setOption(false); // ?????? ?????? ?????? ??????
		}
	};

	useEffect(() => {
		if (toggleMenu) document.addEventListener('mousedown', handleClickOutSide);
		if (isOpenSearchBar)
			document.addEventListener('mousedown', handleClickOutSide); // ????????? ??????
		return () => {
			document.removeEventListener('mousedown', handleClickOutSide); // ????????? ??????
		};
	});

	useEffect(() => {
		setToggleMenu(false);
	}, [params]);

	const handleSearchBar = () => {
		// ?????? ??? ?????????
		if (!isOpenSearchBar) setIsOpenSearchBar(true);
	};

	const handleSearchOption = (e) => {
		// ?????? ?????? ?????????
		setSearchOption(e.target.name);
		dispatch(reset());
	};

	const handleSearchMenu = (e) => {
		// ?????? ?????? ?????? ?????????
		setOption(e.target.id);
		e.target.id === 'location' ? setFruit(null) : setLocation(null);
		if(e.target.id === 'total') dispatch(reset());
	};

	return (
		<StyledHeader>
			<LogoContainer onClick={() => navigate('/')}>
				<LogoImg src={Logo} alt="logo" />
			</LogoContainer>
			{isOpenSearchBar && (
				<ActiveSearchBar toggle={isOpenSearchBar} ref={searchRef}>
					{/* <div>
						<button name="location" onClick={(e) => handleSearchOption(e)}>
							??????
						</button>
						<button name="fruit" onClick={(e) => handleSearchOption(e)}>
							??????
						</button>
					</div> */}
					<SearchOption>
							<div id="total" onClick={(e)=> handleSearchMenu(e)}>
								??????
							</div>
							<div id="location" onClick={(e) => handleSearchMenu(e)}>
								??????
							</div>
							<div id="fruit" onClick={(e) => handleSearchMenu(e)}>
								??????
							</div>
						{/* <div id="date" onClick={(e) => handleSearchMenu(e)}>
							??????
						</div> */}
					</SearchOption>
					{(option === 'location' && (
						<SearchMenu children={<Selector searchType={option} />} />
					)) ||
						(option === 'fruit' && (
							<SearchMenu children={<Selector searchType={option} />} />
						))}
				</ActiveSearchBar>
			)}
			<StyledSearchBar 
				toggle={isOpenSearchBar} 
				onClick={handleSearchBar} >
				<p>?????? ?????? ?????? ????????????</p>
				<AiOutlineMenu size={25} />
			</StyledSearchBar>

			<div ref={ref}>
				<StyledNav toggle={toggleMenu} ref={ref}>
					<button onClick={() => setToggleMenu((prev) => !prev)}>
						<HiMenu size={25} />
						<HiUserCircle size={30} />
					</button>
				</StyledNav>
				<StyledMenu toggle={toggleMenu} ref={ref}>
					{token === null ? (
						<div>
							{beforeLoginList.map((item) => (
								<StyledLink to={item.path} key={item.id}>
									{item.name}
								</StyledLink>
							))}
						</div>
					) : userType === 'farmer' ? (
						<div>
							{farmerLoginList.map((item) => (
								<StyledLink to={item.path} key={item.id}>
									{item.name}
								</StyledLink>
							))}
							<StyledLogout>
								<StyledBtn
									onClick={() => {
										setToggleMenu(false);
										logout();
									}}
								>
									????????????
								</StyledBtn>
							</StyledLogout>
						</div>
					) : (
						<div>
							{afterLoginList.map((item) => (
								<StyledLink to={item.path} key={item.id}>
									{item.name}
								</StyledLink>
							))}
							<StyledLogout>
								<StyledBtn
									onClick={() => {
										setToggleMenu(false);
										logout();
									}}
								>
									????????????
								</StyledBtn>
							</StyledLogout>
						</div>
					)}
				</StyledMenu>
			</div>
		</StyledHeader>
	);
};

export default React.memo(Header);
