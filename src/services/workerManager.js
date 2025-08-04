class WorkerManager {
  constructor(maxWorkers = 2, workerScript = '/workers/pdfCompressionWorker.js') {
    this.maxWorkers = maxWorkers;
    this.workerScript = workerScript;
    this.workers = [];
    this.availableWorkers = [];
    this.busyWorkers = new Set();
    this.taskQueue = [];
    this.activeTasks = new Map();
    
    this.initializeWorkers();
  }
  
  initializeWorkers() {
    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = new Worker(this.workerScript);
      
      worker.onmessage = (e) => {
        this.handleWorkerMessage(worker, e.data);
      };
      
      worker.onerror = (error) => {
        console.error('Worker error:', error);
        this.handleWorkerError(worker, error);
      };
      
      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }
  
  handleWorkerMessage(worker, data) {
    const { type, fileId } = data;
    const task = this.activeTasks.get(fileId);
    
    if (!task) {
      console.warn('Received message for unknown task:', fileId);
      return;
    }
    
    switch (type) {
      case 'progress':
        if (task.onProgress) {
          task.onProgress(data);
        }
        break;
        
      case 'completed':
        if (task.onCompleted) {
          task.onCompleted(data);
        }
        this.releaseWorker(worker, fileId);
        break;
        
      case 'error':
        if (task.onError) {
          task.onError(data);
        }
        this.releaseWorker(worker, fileId);
        break;
    }
  }
  
  handleWorkerError(worker, error) {
    // Find tasks assigned to this worker and handle errors
    for (const [fileId, task] of this.activeTasks.entries()) {
      if (task.worker === worker) {
        if (task.onError) {
          task.onError({ fileId, error: error.message });
        }
        this.activeTasks.delete(fileId);
      }
    }
    
    this.releaseWorker(worker);
  }
  
  releaseWorker(worker, fileId = null) {
    if (fileId) {
      this.activeTasks.delete(fileId);
    }
    
    this.busyWorkers.delete(worker);
    this.availableWorkers.push(worker);
    
    // Process next task in queue
    this.processQueue();
  }
  
  compressFile(file, onProgress, onCompleted, onError) {
    const fileId = `${file.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const task = {
      fileId,
      file,
      onProgress,
      onCompleted,
      onError
    };
    
    if (this.availableWorkers.length > 0) {
      this.assignTask(task);
    } else {
      this.taskQueue.push(task);
    }
    
    return fileId;
  }
  
  assignTask(task) {
    const worker = this.availableWorkers.pop();
    this.busyWorkers.add(worker);
    
    task.worker = worker;
    this.activeTasks.set(task.fileId, task);
    
    // Convert file to ArrayBuffer and send to worker
    task.file.arrayBuffer().then(buffer => {
      worker.postMessage({
        fileId: task.fileId,
        fileName: task.file.name,
        fileBuffer: buffer,
        type: task.file.type
      });
    }).catch(error => {
      console.error('Error reading file:', error);
      if (task.onError) {
        task.onError({ fileId: task.fileId, error: error.message });
      }
      this.releaseWorker(worker, task.fileId);
    });
  }
  
  processQueue() {
    while (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
      const task = this.taskQueue.shift();
      this.assignTask(task);
    }
  }
  
  getQueueStatus() {
    return {
      totalWorkers: this.workers.length,
      availableWorkers: this.availableWorkers.length,
      busyWorkers: this.busyWorkers.size,
      queuedTasks: this.taskQueue.length,
      activeTasks: this.activeTasks.size
    };
  }
  
  terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.availableWorkers = [];
    this.busyWorkers.clear();
    this.taskQueue = [];
    this.activeTasks.clear();
  }
}

export default WorkerManager;