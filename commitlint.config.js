module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'test',
                'chore',
                'perf',
                'ci',
                'build',
                'revert',
            ],
        ],
        'subject-max-length': [2, 'always', 100],
        'subject-case': [0],
        'subject-full-stop': [0],
    },
};
