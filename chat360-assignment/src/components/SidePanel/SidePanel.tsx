import { memo } from 'react';
import { IconKeyboard, IconBolt, IconLock } from '@tabler/icons-react';
import { Paper, Text, Stack, Group, ThemeIcon } from '@mantine/core';
import './SidePanel.scss';

interface Props {
    isStreaming: boolean;
}

const SidePanel = memo(({ isStreaming }: Props) => {
    return (
        <aside className="side-panel">
            <Stack spacing="md">
                {/* Status card */}
                <Paper withBorder p="md" radius="md" className="side-panel__card">
                    <Text size="xs" weight={600} color="dimmed" mb={12} transform="none">
                        Chat status
                    </Text>
                    <Group spacing="sm" noWrap align="flex-start">
                        <span className={`status-dot${isStreaming ? ' status-dot--streaming' : ' status-dot--connected'}`} />
                        <div>
                            <Text size="sm" weight={600} color={isStreaming ? 'indigo' : 'green'}>
                                {isStreaming ? 'Streaming' : 'Connected'}
                            </Text>
                            <Text size="xs" color="dimmed">
                                {isStreaming ? 'Generating response...' : 'Streaming responses'}
                            </Text>
                        </div>
                    </Group>
                </Paper>

                {/* Tips card */}
                <Paper withBorder p="md" radius="md" className="side-panel__card">
                    <Text size="xs" weight={600} color="dimmed" mb={12}>
                        Tips
                    </Text>

                    <Stack spacing="md">
                        <Group spacing="sm" noWrap align="flex-start">
                            <ThemeIcon variant="light" color="indigo" radius="md" size={28}>
                                <IconKeyboard size={16} />
                            </ThemeIcon>
                            <div>
                                <Text size="sm" weight={500}>Press Enter to send</Text>
                                <Text size="xs" color="dimmed">Shift + Enter for new line</Text>
                            </div>
                        </Group>

                        <Group spacing="sm" noWrap align="flex-start">
                            <ThemeIcon variant="light" color="indigo" radius="md" size={28}>
                                <IconBolt size={16} />
                            </ThemeIcon>
                            <div>
                                <Text size="sm" weight={500}>Responses are streamed</Text>
                                <Text size="xs" color="dimmed">You'll see tokens appear as they are generated</Text>
                            </div>
                        </Group>

                        <Group spacing="sm" noWrap align="flex-start">
                            <ThemeIcon variant="light" color="indigo" radius="md" size={28}>
                                <IconLock size={16} />
                            </ThemeIcon>
                            <div>
                                <Text size="sm" weight={500}>Your data is private</Text>
                                <Text size="xs" color="dimmed">Messages are not stored or used for training</Text>
                            </div>
                        </Group>
                    </Stack>
                </Paper>
            </Stack>
        </aside>
    );
});

SidePanel.displayName = 'SidePanel';

export default SidePanel;
