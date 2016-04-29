import {Component, Input, OnInit} from 'angular2/core';
import {Song} from '../../shared/interfaces/song';

@Component({
  selector: 'song-detail',
  templateUrl: 'app/components/song-detail/song-detail.html',
  styleUrls: ['app/components/song-detail/song-detail.css'],
  providers: [],
  directives: [],
  pipes: []
})

export class SongDetail {
  @Input() song: Song;

  constructor() {}

  ngOnInit() {}
}
