import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { diffInDays, estimateReadingTime, formatDate } from './date';
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
const sortNumber = (a, b) => a - b;
export const calculateNoteFrequency = (notes, start, end) => {
    const totalDays = diffInDays(start, end);
    const counts = new Map();
    for (let i = 0; i < totalDays; i += 1) {
        const date = dayjs(start).add(i, 'day').format('YYYY-MM-DD');
        counts.set(date, 0);
    }
    notes.forEach((note) => {
        const date = dayjs(note.createdAt).format('YYYY-MM-DD');
        if (counts.has(date)) {
            counts.set(date, (counts.get(date) ?? 0) + 1);
        }
    });
    return Array.from(counts.entries()).map(([date, count]) => ({ date, count }));
};
export const calculateTaskCompletionMetrics = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Number(((completed / total) * 100).toFixed(1));
    return { completed, total, pending, completionRate };
};
export const calculateFocusMetrics = (sessions) => {
    const totalMinutes = sessions.reduce((acc, session) => acc + session.durationMinutes, 0);
    const sessionsCount = sessions.length;
    const averageSessionMinutes = sessionsCount === 0 ? 0 : Number((totalMinutes / sessionsCount).toFixed(1));
    return { totalMinutes, sessionsCount, averageSessionMinutes };
};
export const calculateTagUsage = (notes) => {
    const map = new Map();
    notes.forEach((note) => {
        note.tags.forEach((tag) => {
            map.set(tag, (map.get(tag) ?? 0) + 1);
        });
    });
    return Array.from(map.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
};
const getPeriodKey = (date, view) => {
    const d = dayjs(date);
    switch (view) {
        case 'weekly':
            return `${d.isoWeekYear()}-W${d.isoWeek().toString().padStart(2, '0')}`;
        case 'monthly':
            return d.format('YYYY-MM');
        case 'daily':
        default:
            return d.format('YYYY-MM-DD');
    }
};
export const calculateProductivityTrends = (notes, tasks, sessions, view) => {
    const map = new Map();
    const ensureEntry = (period) => {
        if (!map.has(period)) {
            map.set(period, { period, notesCreated: 0, tasksCompleted: 0, focusMinutes: 0 });
        }
        return map.get(period);
    };
    notes.forEach((note) => {
        const period = getPeriodKey(note.createdAt, view);
        const entry = ensureEntry(period);
        entry.notesCreated += 1;
    });
    tasks.forEach((task) => {
        if (!task.completed || !task.completedAt)
            return;
        const period = getPeriodKey(task.completedAt, view);
        const entry = ensureEntry(period);
        entry.tasksCompleted += 1;
    });
    sessions.forEach((session) => {
        const period = getPeriodKey(session.startedAt, view);
        const entry = ensureEntry(period);
        entry.focusMinutes += session.durationMinutes;
    });
    return Array.from(map.values()).sort((a, b) => (a.period > b.period ? 1 : -1));
};
export const calculateNoteLengthStats = (notes) => {
    if (notes.length === 0) {
        return {
            averageWordCount: 0,
            medianWordCount: 0,
            minWordCount: 0,
            maxWordCount: 0,
            averageReadingTime: 0
        };
    }
    const wordCounts = notes.map((note) => note.wordCount).sort(sortNumber);
    const totalWords = wordCounts.reduce((acc, count) => acc + count, 0);
    const averageWordCount = Number((totalWords / notes.length).toFixed(1));
    const middle = Math.floor(wordCounts.length / 2);
    const medianWordCount = wordCounts.length % 2 === 0 ? (wordCounts[middle - 1] + wordCounts[middle]) / 2 : wordCounts[middle];
    const minWordCount = wordCounts[0];
    const maxWordCount = wordCounts[wordCounts.length - 1];
    const averageReadingTime = Number((notes.reduce((acc, note) => acc + estimateReadingTime(note.wordCount), 0) /
        notes.length).toFixed(1));
    return {
        averageWordCount,
        medianWordCount,
        minWordCount,
        maxWordCount,
        averageReadingTime
    };
};
export const calculateGoalProgress = (goals) => goals.map((goal) => {
    const progressPercentage = Math.min(100, Number(((goal.currentValue / goal.targetValue) * 100).toFixed(1)));
    return {
        goal,
        progressPercentage,
        remaining: Math.max(0, goal.targetValue - goal.currentValue)
    };
});
export const buildComparisonMetrics = (current, previous) => {
    const currentNotes = current.notes.length;
    const previousNotes = previous.notes.length;
    const currentTasks = current.tasks.filter((task) => task.completed).length;
    const previousTasks = previous.tasks.filter((task) => task.completed).length;
    const currentFocus = current.sessions.reduce((acc, session) => acc + session.durationMinutes, 0);
    const previousFocus = previous.sessions.reduce((acc, session) => acc + session.durationMinutes, 0);
    const build = (metric, cur, prev) => {
        const change = cur - prev;
        const changePercentage = prev === 0 ? (cur === 0 ? 0 : 100) : Number(((change / prev) * 100).toFixed(1));
        return { metric, currentValue: cur, previousValue: prev, change, changePercentage };
    };
    return [
        build('Notes Created', currentNotes, previousNotes),
        build('Tasks Completed', currentTasks, previousTasks),
        build('Focus Minutes', currentFocus, previousFocus)
    ];
};
export const generateInsights = ({ noteStats, taskMetrics, focusMetrics, tagUsage }) => {
    const insights = [];
    if (taskMetrics.completionRate >= 85) {
        insights.push({
            id: 'task-success',
            title: 'Excellent Task Completion',
            description: 'You are completing the majority of your tasks on time. Keep up the momentum!',
            severity: 'positive'
        });
    }
    else if (taskMetrics.completionRate < 50) {
        insights.push({
            id: 'task-warning',
            title: 'Task Completion Lagging',
            description: 'Consider reducing your active tasks or setting clearer priorities to improve completion rate.',
            severity: 'warning'
        });
    }
    if (focusMetrics.averageSessionMinutes < 25 && focusMetrics.sessionsCount > 0) {
        insights.push({
            id: 'focus-short',
            title: 'Short Focus Sessions',
            description: 'Your focus sessions are shorter than the recommended Pomodoro length. Try extending them for deeper work.',
            severity: 'info'
        });
    }
    if (noteStats.averageWordCount > 800) {
        insights.push({
            id: 'note-lengthy',
            title: 'Lengthy Notes Detected',
            description: 'Long-form notes dominate your workspace. Consider summarizing to improve review speed.',
            severity: 'info'
        });
    }
    if (tagUsage.length > 0 && tagUsage[0].count >= 5) {
        insights.push({
            id: 'tag-patterns',
            title: 'Tag Usage Patterns',
            description: `The tag "${tagUsage[0].tag}" is heavily used. Explore creating saved filters or automations for it.`,
            severity: 'positive'
        });
    }
    if (insights.length === 0) {
        insights.push({
            id: 'steady-progress',
            title: 'Consistent Progress',
            description: 'Your usage patterns are balanced. Continue refining your workflows for incremental gains.',
            severity: 'positive'
        });
    }
    return insights;
};
export const prepareCsvData = (notes, tasks, sessions) => {
    const noteRows = notes
        .map((note) => [
        'note',
        note.id,
        JSON.stringify(note.title),
        note.tags.join('|'),
        formatDate(note.createdAt),
        note.wordCount,
        note.readingTimeMinutes
    ].join(','))
        .join('\n');
    const taskRows = tasks
        .map((task) => [
        'task',
        task.id,
        JSON.stringify(task.title),
        task.completed,
        formatDate(task.createdAt),
        task.completedAt ? formatDate(task.completedAt) : '',
        task.dueDate ? formatDate(task.dueDate) : ''
    ].join(','))
        .join('\n');
    const sessionRows = sessions
        .map((session) => [
        'focus',
        session.id,
        formatDate(session.startedAt),
        formatDate(session.endedAt),
        session.durationMinutes
    ].join(','))
        .join('\n');
    const header = 'type,id,title_or_date,tags_or_status,created_at_or_end,meta_1,meta_2';
    return [header, noteRows, taskRows, sessionRows].filter(Boolean).join('\n');
};
export const prepareJsonData = (notes, tasks, sessions, goals) => JSON.stringify({
    generatedAt: new Date().toISOString(),
    notes,
    tasks,
    focusSessions: sessions,
    goals
}, null, 2);
