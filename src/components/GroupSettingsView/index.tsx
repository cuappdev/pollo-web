import cx from 'classnames';
import React, { useState } from 'react';
import { CSVLink } from 'react-csv';

import GroupHeaderView from '../GroupHeaderView';
import IconView from '../IconView';
import LinksView from '../LinksView';
import LogoView from '../LogoView';

import { ExportType, Poll, PollDate, Session } from '../../types';
import { getDateString } from '../../utils/functions';
import { exportCsv } from '../../utils/requests';

import './styles.scss';

export interface GroupSettingsViewProps {
    onLogoutButtonClick(): void;
    session: Session;
}

interface GroupSettingsViewState {
    csv?: string;
    isExporting: boolean;
    isExportDropdownVisible: boolean;
    selectedExportType: ExportType;
    selectedDates: PollDate[];
}

const GroupSettingsView: React.FunctionComponent<GroupSettingsViewProps> = ({
    onLogoutButtonClick,
    session,
}) => {
    const [state, setState] = useState<GroupSettingsViewState>({
        csv: undefined,
        isExporting: false,
        isExportDropdownVisible: false,
        selectedExportType: 'CMS',
        selectedDates: [],
    });

    const containsLivePoll = (date: PollDate) => {
        return date.polls.find((poll: Poll) => poll.state === 'live') !== undefined;
    };

    const isSelectedDate = (date: PollDate) => {
        return state.selectedDates.find((other: PollDate) => {
            return other.date === date.date;
        }) !== undefined;
    };

    const onDateButtonClick = (date: PollDate) => {
        if (state.selectedDates.find((other: PollDate) => other.date === date.date)) {
            setState({
                ...state,
                csv: undefined,
                selectedDates: state.selectedDates.filter((other: PollDate) => other.date !== date.date),
            });
        } else {
            setState({
                ...state,
                csv: undefined,
                selectedDates: [...state.selectedDates, date],
            });
        }
    };

    const onExportButtonClick = async () => {
        setState({ ...state, isExportDropdownVisible: false, isExporting: true });
        try {
            const dates = state.selectedDates.map((date: PollDate) => {
                return new Date(parseFloat(date.date) * 1000);
            });
            const { data } = await exportCsv(session.id, state.selectedExportType, dates);
            setState({ ...state, csv: data, isExporting: false });
        } catch (error) {
            console.log(error);
            setState({ ...state, isExporting: false });
        }
    };

    const onSelectAllDatesButtonClick = () => {
        if (!session.dates) {
            return;
        }
        setState({ 
            ...state, 
            selectedDates: state.selectedDates.length === session.dates.length ? [] : session.dates,
        });
    };

    const onSelectExportType = (exportType: ExportType) => {
        setState({
            ...state,
            csv: undefined,
            isExportDropdownVisible: false,
            selectedExportType: exportType,
        });
    };

    const renderDateButtonContent = (date: PollDate) => {
        const isLive = containsLivePoll(date);
        return (
            <>
                <div className="group-settings-view-date-text-container">
                    {isLive && (
                        <div className="group-settings-view-live-dot" />
                    )}
                    <div 
                        className={cx(
                            'group-settings-view-date-text',
                            isLive && 'live',
                        )}
                    >
                        {getDateString(date.date)}
                    </div>
                </div>
                <div className="group-settings-view-date-selection-icon">
                    <IconView type={isSelectedDate(date) ? 'export-date-selected' : 'export-date-unselected'} />
                </div>
            </>
        );
    };

    const renderDates = (dates: PollDate[]) => {
        if (dates.length > 5) {
            const rows: PollDate[][] = [];
            let currentRow: PollDate[] = [];
            dates.forEach((date: PollDate) => {
                currentRow.push(date);
                if (currentRow.length === 2) {
                    rows.push(currentRow);
                    currentRow = [];
                }
            });
            return rows.map((row: PollDate[]) => {
                const dateOne = row[0];
                const dateTwo = row.length > 1 && row[1];
                return (
                    <div className="group-settings-view-date-row-container">
                        <button
                            className={cx(
                                'group-settings-view-date-button',
                                'row-left',
                            )}
                            onClick={() => onDateButtonClick(dateOne)}
                        >
                            {renderDateButtonContent(dateOne)}
                        </button>
                        {dateTwo && (
                            <button
                                className={cx(
                                    'group-settings-view-date-button',
                                    'row-right',
                                )}
                                onClick={() => onDateButtonClick(dateTwo)}
                            >
                                {renderDateButtonContent(dateTwo)}
                            </button>
                        )}
                    </div>
                );
            });
        }
        return dates.map((date: PollDate, index: number) => {
            return (
                <button
                    className={cx(
                        'group-settings-view-date-button',
                        dates.length <= 3 ? 'tall' : 'short',
                        index === dates.length - 1 && 'last',
                    )}
                    onClick={() => onDateButtonClick(date)}
                >
                    {renderDateButtonContent(date)}
                </button>
            );
        });
    };

    const toggleExportDropdown = () => {
        setState({ 
            ...state, 
            csv: undefined, 
            isExportDropdownVisible: !state.isExportDropdownVisible, 
        });
    };

    return (
        <div className="group-settings-view-container">
            <GroupHeaderView
                type={{
                    type: 'group-settings',
                    code: session.code,
                    title: session.name,
                    onLogoutButtonClick,
                }}
            />
            <div className="group-settings-view-spacer">
                <div className="group-settings-view-top-container">
                    {session.dates && session.dates.length > 0 ? (
                        <div
                            className={cx(
                                'group-settings-view-dates-container',
                                session.dates.length > 5 && 'wide',
                            )}
                        >
                            <div className="group-settings-view-select-all-dates-button-container">
                                <button 
                                    className="group-settings-view-select-all-dates-button"
                                    onClick={onSelectAllDatesButtonClick}
                                >
                                    {state.selectedDates.length === session.dates.length ? 'Unselect' : 'Select'} All
                                </button>
                            </div>
                            <div
                                className={cx(
                                    'group-settings-view-dates-scroll-container',
                                    session.dates.length > 10 && 'scrollable',
                                )}
                            >
                                {renderDates(session.dates)}
                            </div>
                        </div>
                    ) : (
                        <div className="group-settings-view-dates-container">
                            <div className="group-settings-view-dates-empty-text">
                                No attendance dates to export
                            </div>
                            <div className="group-settings-view-dates-empty-icon">
                                <LogoView type="gray" />
                            </div>
                        </div>
                    )}
                </div>
                <div className="group-settings-view-bottom-container">
                    <div className="group-settings-view-export-dropdown-container">
                        <div className="group-settings-view-export-label">
                            Export for
                        </div>
                        <button
                            className="group-settings-view-export-dropdown-button"
                            onClick={toggleExportDropdown}
                        >
                            <div className="group-settings-view-export-type">
                                {state.selectedExportType}
                            </div>
                            <div className="group-settings-view-export-dropdown-arrow-container">
                                <IconView type="export-dropdown" />
                            </div>
                        </button>
                        {state.isExportDropdownVisible && (
                            <div className="group-settings-view-dropdown">
                                <button
                                    className="group-settings-view-dropdown-item"
                                    onClick={() => onSelectExportType(
                                        state.selectedExportType === 'CMS' ? 'Canvas' : 'CMS'
                                    )}
                                >
                                    {state.selectedExportType === 'CMS' ? 'Canvas' : 'CMS'}
                                </button>
                            </div>
                        )}
                    </div>
                    {state.csv ? (
                        <CSVLink
                            className={cx('group-settings-view-export-button', 'enabled')}
                            data={state.csv}
                            filename={`${session.name}.csv`}
                            target="_blank"
                        >
                            Open CSV
                        </CSVLink>
                    ) : (
                        <button
                            className={cx(
                                'group-settings-view-export-button',
                                state.selectedDates.length > 0 && 'enabled',
                            )}
                            disabled={state.selectedDates.length === 0 || state.isExporting}
                            onClick={onExportButtonClick}
                        >
                            {state.isExporting ? 'Exporting...' : 'Export'}
                        </button>
                    )}
                    <LinksView />
                </div>
            </div>
        </div>
    );
};

export default GroupSettingsView;
