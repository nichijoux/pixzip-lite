declare namespace Pixzip {
	type SafeNumber = `${number}` | number;
	type Format = 'original' | 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif';
	type Space = {
		id: string;
		name: string;
		width?: number;
		height?: number;
		suffix: string;
		format: Format;
		level: number;
		originalOutput: boolean;
		outputDir?: string;
		keepExif: boolean;
	};
	type TaskStatus = 'waiting' | 'preprocessing' | 'processing' | 'succeed' | 'failed';
	type Task = { workspaceId: string; filepath: string };
	type SendData =
		| {
				workspaceId: string;
				filepath: string;
				status: Extract<TaskStatus, 'processing'>;
		  }
		| {
				workspaceId: string;
				filepath: string;
				status: Extract<TaskStatus, 'succeed'>;
				outputPath: string;
				fileSize: number;
		  }
		| {
				workspaceId: string;
				filepath: string;
				status: Extract<TaskStatus, 'failed'>;
		  };
}

type ProcessingTask = {
	spaceId: string;
	filepath: string;
	status: 'processing';
	outputPath: string;
	fileSize: number;
	extname: string;
	targetExtname: string;
};
type CompletedTask = {
	spaceId: string;
	filepath: string;
	status: 'completed';
	outputPath: string;
	fileSize: number;
	outSize: number;
	extname: string;
	targetExtname: string;
};
type FailedTask = {
	spaceId: string;
	filepath: string;
	status: 'failed';
	fileSize: number;
	outputPath: string;
	extname: string;
	targetExtname: string;
};

type FileInfo = {
	path: string;
	size: number;
};
type FileTask = ProcessingTask | CompletedTask | FailedTask;

type RendererHandlers = {
	maximizeApp: () => void;
	unmaximizeApp: () => void;
	scanned: (fileInfoList: FileInfo[]) => void;
	completed: (data: CompletedTask) => void;
	failed: (data: FailedTask) => void;
	updateTheme: (isDark: boolean) => void;
};
